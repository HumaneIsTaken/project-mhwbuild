import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ImageValidationService {

    private maxWidth = 200;
    private maxHeight = 200;
    private maxFileSize = 1000; // in KB

    constructor( private http : HttpClient) {}

    public checkImageDimensions(img: any) : boolean{
        if(img.width != img.height) return false;
        if(img.width > this.maxWidth) return false;
        if(img.height > this.maxHeight) return false;
        return true;
    }

    checkImageFileType(file: any) : boolean{
        switch(file.type){
            case "image/png":
            case "image/jpeg":
            case "image/gif":
                return true;
            default:
                return false;
        }
    }

    checkImageFileSize(file: any) : boolean{
        if(Math.round(file.size/1024) > this.maxFileSize) return false;
        return true;
    }

}