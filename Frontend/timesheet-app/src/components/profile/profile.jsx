import React, { Component } from 'react'
import './profile.css';
import { Form, Input, Button, Typography, Avatar, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'

const { Title } = Typography;

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            phone: '',
            email: '',
            address: '',
            emergencyContact1Name: '',
            emergencyContact1Phone: '',
            emergencyContact2Name: '',
            emergencyContact2Phone: '',
            userProfiles: this.props.userProfile,
            fileList: []
        };
    }

    // componentDidMount() {
    //     axios.get('http://localhost:9000/core/test/profile')
    //       .then(res => {
    //         const userProfile1 = res.data;
    //         this.setState({ userProfile1 });
    //       })
    //   }

     testData = (e) => {
         //console.log(localStorage);
         console.log(this.state.userProfiles);
     };

    saveUpdate = (e) => {
        e.preventDefault();
        console.log(this.state)
        this.state.username = this.state.userProfiles.user.username;
        if (this.state.phone === "") {
            this.state.phone = this.state.userProfiles.user.phone;
        }
        if (this.state.email === "") {
            this.state.email = this.state.userProfiles.user.email;
        }
        if (this.state.address === "") {
            this.state.address = this.state.userProfiles.user.address;
        }
        if (this.state.emergencyContact1Name === "") {
            this.state.emergencyContact1Name = this.state.userProfiles.user.emergencyContacts[0].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[0].lastName;
        }
        if (this.state.emergencyContact1Phone === "") {
            this.state.emergencyContact1Phone = this.state.userProfiles.user.emergencyContacts[0].phone;
        }
        if (this.state.emergencyContact2Name === "") {
            this.state.emergencyContact2Name = this.state.userProfiles.user.emergencyContacts[1].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[1].lastName;
        }
        if (this.state.emergencyContact2Phone === "") {
            this.state.emergencyContact2Phone = this.state.userProfiles.user.emergencyContacts[1].phone;
        }
        console.log(this.state)
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/test/updateprofile',
            data: {
                username: this.state.username,
                phone: this.state.phone,
                email: this.state.email,
                address: this.state.address,
                emergencyContact1Name: this.state.emergencyContact1Name,
                emergencyContact1Phone: this.state.emergencyContact1Phone,
                emergencyContact2Name: this.state.emergencyContact2Name,
                emergencyContact2Phone: this.state.emergencyContact2Phone,
            }
            })
            .then((response) => {
                console.log(response)
                alert("Your profile has been updated");
                window.location.reload(false);
            })
            .catch((error) => {
                console.log(error)
        })
    };

    handlePhoneChange = (e) => {
        this.setState({phone: e.target.value});
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    handleAddressChange = (e) => {
        this.setState({address: e.target.value});
    }

    handleEmergencyContact1NameChange = (e) => {
        this.setState({emergencyContact1Name: e.target.value});
    }

    handleEmergencyContact1PhoneChange = (e) => {
        this.setState({emergencyContact1Phone: e.target.value});
    }

    handleEmergencyContact2NameChange = (e) => {
        this.setState({emergencyContact2Name: e.target.value});
    }

    handleEmergencyContact2PhoneChange = (e) => {
        this.setState({emergencyContact2Phone: e.target.value});
    }

    beforeUpload = (file) => {
        console.log(file)
        let files = [file];
        this.setState({
            fileList: [...files]
        })
        return false;
   };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {

          return;
        }
        if (info.file.status === 'done') {
          
        }
    };

    submit = () => {
        console.log(this.state)
        const formData = new FormData();
        //for single file upload
        formData.append('file', this.state.fileList[0]);
        //add another parameter other than the file
        formData.set("a", 1);
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/test/fileUploadWithForm',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
        })
    }

    render() {

        return (
            <div style={{textAlign: "left"}}>

                <Form labelCol={{ span: 9 }} wrapperCol={{ span: 5, offset: 9 }} layout="horizontal">
                    
                    <Form.Item>
                        <Title level={5} style={{marginTop: "20px"}}>Contact</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.phone} onChange={this.handlePhoneChange} />
                    </Form.Item>
                        
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.email} onChange={this.handleEmailChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea rows={4} placeholder={this.state.userProfiles.user.address} onChange={this.handleAddressChange} />
                    </Form.Item>

                    <Form.Item>
                        <Title level={5}>Emergency Contact 1</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[0].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[0].lastName} onChange={this.handleEmergencyContact1NameChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[0].phone} onChange={this.handleEmergencyContact1PhoneChange} />
                    </Form.Item>
                        
                    <Form.Item>
                        <Title level={5}>Emergency Contact 2</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[1].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[1].lastName} onChange={this.handleEmergencyContact2NameChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[1].phone} onChange={this.handleEmergencyContact2PhoneChange} />
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{marginTop: "20px"}} onClick={this.saveUpdate}>Save Updates</Button>
                    </Form.Item>

                </Form>

            </div>
        )
    }
}

/* <Avatar size={64} icon={<UserOutlined />} />
<Upload 
    onChange={this.handleChange}
    beforeUpload={this.beforeUpload}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
</Upload>
<Button onClick={this.submit}>Submit</Button> */

