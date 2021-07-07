package com.example.core1.service.impl;

import com.example.core1.dao.IUserRepo;
import com.example.core1.domain.Day;
import com.example.core1.domain.TimeSheet;
import com.example.core1.domain.User;
import com.example.core1.domain.Week;
import com.example.core1.service.IUserService;
import com.google.gson.Gson;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class UserServiceImpl implements IUserService {

    private static final Gson gson = new Gson();

    @Autowired
    private IUserRepo iUserRepo;

    @Override
    public Map<String, Object> userInfo(Map<String, Object> param) {
        Map<String, Object> resultMap = new HashMap<>();
        String username = param.get("username").toString();
        List<User> list = iUserRepo.userInfo(username);
        if(list.isEmpty()){
            resultMap.put("result", "failed");
            return resultMap;
        }
        User user = list.get(0);
        resultMap.put("result", "successful");
        resultMap.put("user", user);
        return resultMap;
    }

    @Override
    public Map<String, Object> getAllUsers() {
        Map<String, Object> resultMap = new HashMap<>();
        List<User> list = iUserRepo.findAll();
        resultMap.put("result", list);
        return resultMap;
    }

    @Override
    public User getUserByUsername(String username) {
        List<User> users = iUserRepo.getUserTimesheetByUsername(username);
        if(users.isEmpty())
            return null;
        return users.get(0);
    }

    @Override
    public Week getTemplateByUsername(Map<String, Object> params) {
        List<Week> week= iUserRepo.getUserTemplate(params.get("username"));
        if(week.isEmpty())
            return null;
        return week.get(0);
    }

    @Override
    public boolean updateTemplate(Map<String, Object> params) {
        Week week = this.buildTemplate(params);
        List<User> users = iUserRepo.userInfo(params.get("username").toString());
        if (users.isEmpty())
            return false;
        User user = users.get(0);
        user.setTemplate(week);
        iUserRepo.save(user);
        return true;
    }
    @Override
    public boolean updateTimeSheet(Map<String, Object> params) {
        Week week = this.buildWeek(params);
        List<User> users = iUserRepo.userInfo("zack");
        if(users.isEmpty())
            return false;
        User user = users.get(0);
        AtomicInteger position = new AtomicInteger(-1);
        String year = week.getWeekEnding().toInstant().atZone(ZoneId.systemDefault())
                .toLocalDate().getYear() + "";
        TimeSheet timeSheet = user.getTimeSheets()
                .stream()
                .peek(x -> position.incrementAndGet())
                .filter(item -> item.getYear().equals(year))
                .findFirst().orElse(null);

        if(timeSheet == null) {
            return false;
        }

        //update to timesheet
        AtomicInteger position2 = new AtomicInteger(-1);
        Week existedWeek = timeSheet.getWeeks().stream()
                .peek(x -> position2.incrementAndGet())
                .filter(item -> item.getWeekEnding().getTime() == week.getWeekEnding().getTime())
                .findFirst().orElse(null);
        if(existedWeek == null)
            return false;
        week.setStatus("Pending");

        //check violation of floating days/vacation
        int floatingDaysThisWeek = this.calculateFloatingDaysInAWeek(week);
        int vacationDaysThisWeek = this.calculateVacationDaysInAWeek(week);

        //existed week's floating days and vacation days
        int floatingDaysInExistedWeek = this.calculateFloatingDaysInAWeek(existedWeek);
        int vacationDaysInExistedWeek = this.calculateVacationDaysInAWeek(existedWeek);

        if(floatingDaysThisWeek > timeSheet.getRemainingFloatingDays() + floatingDaysInExistedWeek){
            return false;
        }
        if(vacationDaysThisWeek > timeSheet.getRemainingVacationDays() + vacationDaysInExistedWeek){
            return false;
        }

        //update the remaining vacation days and floating days
        user.getTimeSheets().get(position.get()).setRemainingVacationDays(
                user.getTimeSheets().get(position.get()).getRemainingVacationDays() - vacationDaysThisWeek);
        user.getTimeSheets().get(position.get()).setRemainingFloatingDays(
                user.getTimeSheets().get(position.get()).getTotalFloatingDays() - floatingDaysThisWeek);
        user.getTimeSheets().get(position.get()).getWeeks().set(position2.get(), week);
        iUserRepo.save(user);

        return true;
    }

    @Override
    public boolean addTimesheet(Map<String, Object> params) {
        Week week = this.buildWeek(params);

        List<User> users = iUserRepo.userInfo("zack");
        if(users.isEmpty())
            return false;
        User user = users.get(0);
        AtomicInteger position = new AtomicInteger(-1);
        String year = week.getWeekEnding().toInstant().atZone(ZoneId.systemDefault())
                .toLocalDate().getYear() + "";
        TimeSheet timeSheet = user.getTimeSheets()
                .stream()
                .peek(x -> position.incrementAndGet())
                .filter(item -> item.getYear().equals(year))
                .findFirst().orElse(null);

        if(timeSheet == null) {
            return false;
        }

        //check violation of floating days/vacation
        int floatingDaysThisWeek = this.calculateFloatingDaysInAWeek(week);
        int vacationDaysThisWeek = this.calculateVacationDaysInAWeek(week);
        if(floatingDaysThisWeek > timeSheet.getRemainingFloatingDays()){
            return false;
        }
        if(vacationDaysThisWeek > timeSheet.getRemainingVacationDays()){
            return false;
        }
        week.setStatus("Pending");
        //add to timesheet
        timeSheet.getWeeks().add(week);

        //update the remaining vacation days and floating days
        user.getTimeSheets().get(position.get()).setRemainingVacationDays(
                user.getTimeSheets().get(position.get()).getRemainingVacationDays() - vacationDaysThisWeek);
        user.getTimeSheets().get(position.get()).setRemainingFloatingDays(
                user.getTimeSheets().get(position.get()).getTotalFloatingDays() - floatingDaysThisWeek);

        user.getTimeSheets().set(position.get(), timeSheet);
        iUserRepo.save(user);

        return true;
    }

    @Override
    public Week getWeek(Map<String, Object> params) {
        String username = params.get("username").toString();
        String endDateStr = params.get("endDate").toString();
        List<User> users = iUserRepo.getUserTimesheetByUsername(username);
        if(users.isEmpty())
            return null;
        User user = users.get(0);
        List<TimeSheet> timeSheets = user.getTimeSheets();
        DateTimeFormatter dateTimeFormatter
                = DateTimeFormat.forPattern("MM/dd/yyyy");
        DateTime parsedDateTime = DateTime.parse(endDateStr, dateTimeFormatter);
        TimeSheet timeSheet = timeSheets.stream()
                .filter(item -> item.getYear().equals(parsedDateTime.getYear() + ""))
                .findFirst()
                .orElse(null);
        if(timeSheet == null)
            return null;
        Week week = timeSheet.getWeeks().stream()
                .filter(item -> item.getWeekEnding().getTime() == parsedDateTime.getMillis())
                .findFirst().orElse(null);
        return week;
    }

    @Override
    public Week buildTemplate(Map<String, Object> params){
        //create a week
        Week week = new Week();
        //Sunday
        Map<String, Object> Sunday = gson.fromJson(params.get("Sunday").toString(), Map.class);
        Double startingHour = (Double) Sunday.get("startingHour");
        Double endingHour = (Double) Sunday.get("endingHour");
        Boolean isFloating = (Boolean) Sunday.get("isFloatingDay");
        Boolean isHoliday = (Boolean) Sunday.get("isHoliday");
        Boolean isVacation = (Boolean) Sunday.get("isVacation");
        Day sunday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setSunday(sunday);

        //Monday
        Map<String, Object> Monday = gson.fromJson(params.get("Monday").toString(), Map.class);
        startingHour = (Double) Monday.get("startingHour");
        endingHour = (Double) Monday.get("endingHour");
        isFloating = (Boolean) Monday.get("isFloatingDay");
        isHoliday = (Boolean) Monday.get("isHoliday");
        isVacation = (Boolean) Monday.get("isVacation");
        Day monday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setMonday(monday);

        //Tuesday
        Map<String, Object> Tuesday = gson.fromJson(params.get("Tuesday").toString(), Map.class);
        startingHour = (Double) Tuesday.get("startingHour");
        endingHour = (Double) Tuesday.get("endingHour");
        isFloating = (Boolean) Tuesday.get("isFloatingDay");
        isHoliday = (Boolean) Tuesday.get("isHoliday");
        isVacation = (Boolean) Tuesday.get("isVacation");
        Day tuesday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setTuesday(tuesday);

        //Wednesday
        Map<String, Object> Wednesday = gson.fromJson(params.get("Wednesday").toString(), Map.class);
        startingHour = (Double) Wednesday.get("startingHour");
        endingHour = (Double) Wednesday.get("endingHour");
        isFloating = (Boolean) Wednesday.get("isFloatingDay");
        isHoliday = (Boolean) Wednesday.get("isHoliday");
        isVacation = (Boolean) Wednesday.get("isVacation");
        Day wednesday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setWednesday(wednesday);

        //Thursday
        Map<String, Object> Thursday = gson.fromJson(params.get("Thursday").toString(), Map.class);
        startingHour = (Double) Thursday.get("startingHour");
        endingHour = (Double) Thursday.get("endingHour");
        isFloating = (Boolean) Thursday.get("isFloatingDay");
        isHoliday = (Boolean) Thursday.get("isHoliday");
        isVacation = (Boolean) Thursday.get("isVacation");
        Day thursday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setThursday(thursday);

        //Friday
        Map<String, Object> Friday = gson.fromJson(params.get("Friday").toString(), Map.class);
        startingHour = (Double) Friday.get("startingHour");
        endingHour = (Double) Friday.get("endingHour");
        isFloating = (Boolean) Friday.get("isFloatingDay");
        isHoliday = (Boolean) Friday.get("isHoliday");
        isVacation = (Boolean) Friday.get("isVacation");
        Day friday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setFriday(friday);

        //Saturday
        Map<String, Object> Saturday = gson.fromJson(params.get("Saturday").toString(), Map.class);
        startingHour = (Double) Saturday.get("startingHour");
        endingHour = (Double) Saturday.get("endingHour");
        isFloating = (Boolean) Saturday.get("isFloatingDay");
        isHoliday = (Boolean) Saturday.get("isHoliday");
        isVacation = (Boolean) Saturday.get("isVacation");
        Day saturday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setSaturday(saturday);

        //set weekending

        String endDateStr = "2021-07-03T04:00:00.000+00:00";
        DateTimeFormatter dateTimeFormatter
                = DateTimeFormat.forPattern("MM/dd/yyyy");
        DateTime parsedDateTime = DateTime.parse(endDateStr, dateTimeFormatter);
        week.setWeekEnding(parsedDateTime.toDate());

        return week;
    }

    /**
     * Build a week
     * @param params
     * @return
     */
    private Week buildWeek(Map<String, Object> params){
        //create a week
        Week week = new Week();

        //Sunday
        Map<String, Object> Sunday = gson.fromJson(params.get("Sunday").toString(), Map.class);
        Double startingHour = (Double) Sunday.get("startingHour");
        Double endingHour = (Double) Sunday.get("endingHour");
        Boolean isFloating = (Boolean) Sunday.get("isFloatingDay");
        Boolean isHoliday = (Boolean) Sunday.get("isHoliday");
        Boolean isVacation = (Boolean) Sunday.get("isVacation");
        Day sunday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setSunday(sunday);

        //Monday
        Map<String, Object> Monday = gson.fromJson(params.get("Monday").toString(), Map.class);
        startingHour = (Double) Monday.get("startingHour");
        endingHour = (Double) Monday.get("endingHour");
        isFloating = (Boolean) Monday.get("isFloatingDay");
        isHoliday = (Boolean) Monday.get("isHoliday");
        isVacation = (Boolean) Monday.get("isVacation");
        Day monday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setMonday(monday);

        //Tuesday
        Map<String, Object> Tuesday = gson.fromJson(params.get("Tuesday").toString(), Map.class);
        startingHour = (Double) Tuesday.get("startingHour");
        endingHour = (Double) Tuesday.get("endingHour");
        isFloating = (Boolean) Tuesday.get("isFloatingDay");
        isHoliday = (Boolean) Tuesday.get("isHoliday");
        isVacation = (Boolean) Tuesday.get("isVacation");
        Day tuesday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setTuesday(tuesday);

        //Wednesday
        Map<String, Object> Wednesday = gson.fromJson(params.get("Wednesday").toString(), Map.class);
        startingHour = (Double) Wednesday.get("startingHour");
        endingHour = (Double) Wednesday.get("endingHour");
        isFloating = (Boolean) Wednesday.get("isFloatingDay");
        isHoliday = (Boolean) Wednesday.get("isHoliday");
        isVacation = (Boolean) Wednesday.get("isVacation");
        Day wednesday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setWednesday(wednesday);

        //Thursday
        Map<String, Object> Thursday = gson.fromJson(params.get("Thursday").toString(), Map.class);
        startingHour = (Double) Thursday.get("startingHour");
        endingHour = (Double) Thursday.get("endingHour");
        isFloating = (Boolean) Thursday.get("isFloatingDay");
        isHoliday = (Boolean) Thursday.get("isHoliday");
        isVacation = (Boolean) Thursday.get("isVacation");
        Day thursday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setThursday(thursday);

        //Friday
        Map<String, Object> Friday = gson.fromJson(params.get("Friday").toString(), Map.class);
        startingHour = (Double) Friday.get("startingHour");
        endingHour = (Double) Friday.get("endingHour");
        isFloating = (Boolean) Friday.get("isFloatingDay");
        isHoliday = (Boolean) Friday.get("isHoliday");
        isVacation = (Boolean) Friday.get("isVacation");
        Day friday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setFriday(friday);

        //Saturday
        Map<String, Object> Saturday = gson.fromJson(params.get("Saturday").toString(), Map.class);
        startingHour = (Double) Saturday.get("startingHour");
        endingHour = (Double) Saturday.get("endingHour");
        isFloating = (Boolean) Saturday.get("isFloatingDay");
        isHoliday = (Boolean) Saturday.get("isHoliday");
        isVacation = (Boolean) Saturday.get("isVacation");
        Day saturday = new Day(startingHour.intValue(), endingHour.intValue(),
                isFloating, isHoliday, isVacation);
        week.setSaturday(saturday);

        //set weekending
        String endDateStr = params.get("endDate").toString();
        DateTimeFormatter dateTimeFormatter
                = DateTimeFormat.forPattern("MM/dd/yyyy");
        DateTime parsedDateTime = DateTime.parse(endDateStr, dateTimeFormatter);
        week.setWeekEnding(parsedDateTime.toDate());

        return week;
    }

    private int calculateFloatingDaysInAWeek(Week week){
        int floatingDays = 0;
        floatingDays += week.getMonday().isFloatingDay()?1:0;
        floatingDays += week.getTuesday().isFloatingDay()?1:0;
        floatingDays += week.getWednesday().isFloatingDay()?1:0;
        floatingDays += week.getThursday().isFloatingDay()?1:0;
        floatingDays += week.getFriday().isFloatingDay()?1:0;
        return floatingDays;
    }

    private int calculateVacationDaysInAWeek(Week week){
        int vacationDays = 0;
        vacationDays += week.getMonday().isVacation()?1:0;
        vacationDays += week.getTuesday().isVacation()?1:0;
        vacationDays += week.getWednesday().isVacation()?1:0;
        vacationDays += week.getThursday().isVacation()?1:0;
        vacationDays += week.getFriday().isVacation()?1:0;
        return vacationDays;
    }
}
