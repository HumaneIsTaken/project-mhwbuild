import { Injectable } from '@angular/core';
import { DOMService } from './dom.service';

/*
* Service which helps placing/enabling a modal. The code comes from this article.
* https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a1
* Which im basing this modal implementation on. 
*/

@Injectable()
export class ModalService {

  // Maybe change this to be more flexible?
  private modalId = "modal-container";
  private overlayId = "overlay";
  
  constructor( private domService : DOMService) { }

  init(component : any, inputs: object, outputs: object){
    let compConfig = {
      inputs:inputs,
      outputs:outputs
    }
    this.domService.appendComponentTo(this.modalId, component, compConfig);
    document.getElementById(this.modalId).className = "show";
    document.getElementById(this.overlayId).className = "show";
  }

  destroy(){
    this.domService.removeComponent();
    document.getElementById(this.modalId).className = "hidden";
    document.getElementById(this.overlayId).className = "hidden";
  }
}