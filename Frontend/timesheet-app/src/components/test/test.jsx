import React, { Component } from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios'

export default class TestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        };
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
            <div>
                <Upload 
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Button onClick={this.submit}>Submit</Button>
            </div>
        )
    }
}
