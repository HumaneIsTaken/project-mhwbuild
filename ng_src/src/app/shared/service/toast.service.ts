import { Injectable } from "@angular/core";
import { DOMService } from "./dom.service";
import { ToastComponent } from "../components/toast/toast.component";

enum ToastType {
    ERROR = 0,
    WARNING = 1,
    SUCCESS = 2,
    INFO = 3
}

@Injectable()
export class ToastService {

    private toastContainerId = 'toast-container';

    constructor(private domService : DOMService) {}

    /** Creates a toast which varies in look depending on the parameters provided.
     * @msg {string} The message to be displayed in the toast.
     * @type {ToastType} The type of toast to display 0 = Error, 1 = Warning and 2 = Success.
     * @timeOut {number} Optional parameter, provides the timeout for the toast.
     */
    public createToast(msg : string, type : ToastType, timeOut? : number){
        
        let compConfig = {
            inputs: {toastType : type, message : msg},
            outputs: {}
          }
          
        let toastId = 
            this.domService.appendComponentTo(
                this.toastContainerId, ToastComponent, compConfig);
        
        setTimeout(()=> {
            this.domService.removeComponent(toastId);
        }, timeOut ? timeOut : 4000);
        
    }
}