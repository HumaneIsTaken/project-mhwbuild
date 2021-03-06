import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Item } from '../../models/item.model';
import { Skill } from '../../models/skill.model';

import { DataService } from '../../service/data.service';
import { ImageValidationService } from '../../service/image-validation.service';
import { ToastService } from '../../service/toast.service';

import { validateType } from '../../validators/item.validator';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  private item : Item;
  private itemSkill : Skill; 
  private skills : Array<Skill>;

  private isForm : boolean;
  private formSubmitted : boolean;
  private itemForm: FormGroup;

  private iconProvided : boolean;
  private iconFile : any;
  private defItemIconUrl : string;
  private itemIconUrl : string;

  // Constant variables.
  private types = ["Material", "Consumable/Misc",
    "Specialized Tool", "Decoration", "Ammo/Coating"];
  private rarities = [1, 2, 3, 4, 5, 6, 7, 8];
  private backEndDomain = "http://localhost:4300";

  constructor(private data : DataService, private toast : ToastService,
     private imgUp : ImageValidationService, private fb : FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.defItemIconUrl = this.backEndDomain + "/images/items/default_icon.png";
    this.itemIconUrl = this.defItemIconUrl;
    if(this.item) {
      this.itemIconUrl = this.item.iconUrl;
      if(this.item.type == "Decoration") {
        this.itemSkill = this.skills.find(s => s.skillId == this.item.skillID);
      }
    }
    if(this.isForm){      
      this.formSubmitted = false;
      this.iconProvided = false;

      this.itemForm.get('type').valueChanges
        .subscribe(val => this.setDecoValidators(val));

      if(!this.item) {
        this.item = new Item();
      } else {
        this.setFormValuesOnInit();
      }    
    }
  }

  private setFormValuesOnInit(){
    this.itemForm.setValue({
      id : this.item.id,
      name : this.item.name,
      rarity : this.item.rarity,
      type : this.item.type,
      desc : this.item.desc,
      buy : this.item.buyPrice || null,
      sell : this.item.sellPrice || null,
      carry : this.item.carry,
      obtained : this.item.obtainedFrom,
      skillID : this.itemSkill || null,
      jwlLvl : this.item.jwlLvl || null
    });
  }

  private createForm(){
    const DigitOnly = "^\\d*$";

    this.itemForm = this.fb.group({
      id : ['', Validators.pattern(DigitOnly)],
      name : ['', 
        [ Validators.required, Validators.pattern("[\\w\-+\\s]+"),
          Validators.minLength(2), Validators.maxLength(35)] ],
      rarity : [1, 
        [ Validators.required, Validators.pattern("^[1-8]{1}$")] ],
      type : ['Material', [ Validators.required, validateType ] ],
      desc : ['', 
        [ Validators.required, Validators.pattern("[\\w\\.\\-+\\s!]+"),
          Validators.minLength(5), Validators.maxLength(120)] ],
      buy : ['', 
        [ Validators.maxLength(7), Validators.pattern(DigitOnly)] ],
      sell : ['',
        [ Validators.maxLength(7), Validators.pattern(DigitOnly)] ],
      carry : ['', 
        [ Validators.pattern(DigitOnly), Validators.maxLength(2)] ],
      obtained : [ '', Validators.maxLength(120) ],
      skillID : [''],
      jwlLvl : ['']        
    });
  }

  private setDecoValidators(type : string) {
    const jwlLvlControl = this.itemForm.get('jwlLvl');
    const skillControl = this.itemForm.get('skillID');
    if (type == "Decoration") {
      jwlLvlControl.setValidators(
        [Validators.required, Validators.pattern("^[1-3]?$")]);
      skillControl.setValidators(Validators.required);
    } else {
      jwlLvlControl.clearValidators();
      skillControl.clearValidators();
    }
    jwlLvlControl.updateValueAndValidity();
    skillControl.updateValueAndValidity();
  }

  private onSubmit(event : any){
    this.formSubmitted = true;
    
    if(this.itemForm.valid){
      this.data.addOrUpdateItem(
        this.convertToItem(this.itemForm.value),
        this.iconProvided ? this.iconFile : null
      );
      this.itemForm.reset(this.itemForm.value);
      this.formSubmitted = false;
      this.iconProvided = false;
      this.iconFile = null;
    }
  }

  private onItemIconChange(files : any) {
    var reader = new FileReader();    
    var image = new Image();

    if(!this.imgUp.checkImageFileType(files.item(0))){
      this.toast.createToast("Image file type must be .jpg, .png or .gif", 0);
      return;
    } else if (!this.imgUp.checkImageFileSize(files.item(0))){
      this.toast.createToast("Image file size exceeds the 1MB limit.", 0);
      return;
    }

    reader.onload = (e : any) => {      
      image.src = e.target.result;

      image.onload = (e) => {
        if(!this.imgUp.checkImageDimensions(image)) {
          this.toast
          .createToast("Image height and width must be the same and within 200x200px.", 0);
          return;
        } 
        this.itemIconUrl = image.src;
        this.iconProvided = true;
        this.iconFile = files.item(0);
      }
    }
    reader.readAsDataURL(files.item(0));
  }

  /*
  * Helper functions down below.
  */
  private convertToItem(formValue : any) : Item{
    let item = new Item();
    item.iconUrl = this.item.iconUrl || null;
    item.id = +formValue.id;
    item.name = formValue.name.trim();
    item.desc = formValue.desc.trim();
    item.type = formValue.type;
    item.rarity = +formValue.rarity;
    item.obtainedFrom = formValue.obtained.trim();
    item.carry = +formValue.carry;
    item.buyPrice = +formValue.buy;
    item.sellPrice = +formValue.sell;
    if(item.type == "Decoration") {
      item.skillID = +formValue.skillID.skillId || null;
      item.jwlLvl = +formValue.jwlLvl;
    }
    return item;
  }

  private imgErrHandler(event: any) {
    event.target.src = this.defItemIconUrl;
  }

  // Used by DOMService.
  canCloseModal() : boolean {
    if (!this.isForm) return true;
    return !this.itemForm.dirty;
  }   

}
