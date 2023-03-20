import {Service} from 'typedi';
import {JsonController,
    HttpCode,
    Get,
    Req,
    QueryParam,
    Post,
    UseBefore,
    UploadedFile,
    Param
    } from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import { Request, Response } from 'express';
import { TestService } from '../services/TestService';
import { TestDto } from '../dtos/TestDto';
import { getFile, uploadFile } from '../utils/s3';


@JsonController('/test')
@Service()
export class TestController{
    constructor(private readonly testService:TestService){};
    @HttpCode(200)
    @Get("")
    @OpenAPI({
        summary:"Test Function"
    })
    public async test(){
        
        const result = await this.testService.testFunction();
        console.log(result);
        return result;
    }

    @Post("/image")
    @OpenAPI({
        summary:"Test Image Function"
    })
    
    public async testImage(@UploadedFile('image')file : Express.Multer.File, @Req() req:Request){
        
        const result = await uploadFile(file.originalname,file.buffer);
        
        return 'Complete';
    }

    @Get("/id")
    @OpenAPI({
        summary:"Test Get Image Function"
    })
    public async getImage(@QueryParam('path')path : string){
        
        const result = await getFile(path);
        return result;
    }
}
