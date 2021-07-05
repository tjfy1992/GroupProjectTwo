package com.example.core1.file;


import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class AmazonS3FileService implements InitializingBean {
    @Value("${custom.aws.access-key}")
    private String accessKey;

    @Value("${custom.aws.secret-key}")
    private String accessSecret;

    @Value("${custom.aws.bucket}")
    private String bucket;

    @Value("${custom.aws.endpoint}")
    private String endpoint;

    private AmazonS3 client;

    @Override
    public void afterPropertiesSet() throws Exception {
        ClientConfiguration config = new ClientConfiguration();
        config.setProtocol(Protocol.HTTP);
        this.client = AmazonS3ClientBuilder
                .standard()
                .withClientConfiguration(config)
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, accessSecret)))
                .withRegion(Regions.US_EAST_2)
                .enablePathStyleAccess()
                .build();
    }

    public void printOutName(){
        ObjectListing objectListing = client.listObjects(this.bucket);
        for(S3ObjectSummary os : objectListing.getObjectSummaries()) {
            System.out.println(os.getKey());
        }
    }

    public String upload(InputStream input, String key) throws IOException {
        Date expireDate = new Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(1800));
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setHttpExpiresDate(expireDate);
        metadata.setContentLength(input.available());

        client.putObject(new PutObjectRequest(bucket, key, input, metadata).withCannedAcl(CannedAccessControlList.PublicRead));
        GeneratePresignedUrlRequest urlRequest = new GeneratePresignedUrlRequest(bucket, key);
        URL url = client.generatePresignedUrl(urlRequest);
        return url.toString();
    }

    public List<String> printFilesInOneFolder(String prefix) {
        List<String> documents = new ArrayList<>();

        ListObjectsRequest listObjectsRequest = new ListObjectsRequest().withBucketName(bucket).withPrefix(prefix + "/");
        ObjectListing objectListing = client.listObjects(listObjectsRequest);
        for(S3ObjectSummary os : objectListing.getObjectSummaries()) {
            System.out.println(os.getKey());
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            documents.add(os.getKey().replace(prefix + "/","").split("\\.")[0] + "_" + format.format(os.getLastModified()));
        }
        return documents;
    }

    public void deleteFolder(String prefix) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest().withBucketName(bucket).withPrefix(prefix + "/");
        ObjectListing objectListing = client.listObjects(listObjectsRequest);
        for (S3ObjectSummary os : objectListing.getObjectSummaries()) {
            client.deleteObject(bucket, os.getKey());
        }
        printOutName();
    }

    public void deleteOneFile(String prefix, String fileName) {
        client.deleteObject(bucket, prefix + "/" + fileName);
        printOutName();
    }
}
