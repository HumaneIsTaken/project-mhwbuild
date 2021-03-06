import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ItemsComponent } from './items.component';

import { FormsModule } from '@angular/forms';
import { DataService } from '../shared/service/data.service';
import { ModalService } from '../shared/service/modal.service';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Item } from '../shared/models/item.model';
import { Skill } from '../shared/models/skill.model';
import { eventNames } from 'cluster';
import { ItemDetailComponent } from '../shared/components/item-detail/item-detail.component';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let dataServiceSpy;
  let modalServiceSpy;
  let windowSpy;

  let testSkill : Skill;
  let testItems : Item[];

  function createTestItemArray() {
    let itemArray : Item[] = [];
    for (let i = 1; i<=5; i++ ) {
      let matType;
      switch(i){
        case 1: matType = 'Material'; break;
        case 2: matType = 'Decoration'; break;
        case 3: matType = 'Ammo/Coating'; break;
        case 4: matType = 'Specialized Tool'; break;
        case 5: matType = 'Consumable/Misc'; break;
      }      
      let newItem = new Item();
      newItem.id = i;
      newItem.iconUrl = "default_icon.png";
      newItem.name = `Test Name - ${matType}`;
      newItem.desc = `Test Desc ${i}`;
      newItem.type = matType;
      newItem.rarity = i;
      newItem.carry = i;
      newItem.obtainedFrom = `Some place after ${i} times`;
      newItem.sellPrice = i;
      newItem.buyPrice = i;
      newItem.skillID = i == 2 ? 1 : null;
      newItem.jwlLvl = i == 2 ? 1 : null;
      itemArray.push(newItem);
    }
    return itemArray;
  }

  function createTestItemArrayMultipleOneCat() {
    let itemArray : Item[] = [];
    for (let i = 1; i<=3; i++ ) {
      let newItem = new Item();
      newItem.id = i;
      newItem.iconUrl = "default_icon.png";
      newItem.name = `Test Name - ${i}`;
      newItem.desc = `Test Desc ${i}`;
      newItem.type = 'Material';
      newItem.rarity = i;
      newItem.carry = i;
      newItem.obtainedFrom = `Some place after ${i} times`;
      newItem.sellPrice = i;
      newItem.buyPrice = i;
      newItem.skillID = null;
      newItem.jwlLvl = null;
      itemArray.push(newItem);
    }
    return itemArray;
  }

  function createTestSkill(){
    let skill = new Skill();
    skill.skillId = 1;
    skill.skillLvls = [{skillLvl: 1, lvlDesc: 'Something'}];
    skill.iconPath = "default_icon.png";
    skill.name = "Test Skill";
    skill.desc = "Absolute trash skill";
    return skill;
  } 

  const ctrlClickEvent = new MouseEvent('click', { ctrlKey: true });

  beforeEach(async(() => {
    testSkill = createTestSkill();
    testItems = createTestItemArray();

    windowSpy = spyOn(window, 'confirm').and.callThrough();
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getItems', 'getSkills',
      'addOrUpdateItem', 'deleteItems']);
    dataServiceSpy.getSkills.and.returnValue(of([testSkill]));
    dataServiceSpy.getItems.and.returnValue(of(testItems));
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['destroy', 'init']);

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ ItemsComponent ],
      providers:  [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },        
        { provide: ActivatedRoute, useValue: {
            url: Observable.of([{path: 'items'}, {path: 'mats'}])
        } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all items of category material successfully', () => {
    // Route set-up and component creation
    TestBed.get(ActivatedRoute).url = of([{path: 'items'}, {path: 'mats'}]);
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelector('.item-card-container');
    expect(items.querySelector(".item-card-name").textContent).toContain("Material");
    expect(items.querySelector(".item-card-skill")).toBeNull();
  });

  it('should render all items of category ammo/coating successfully', () => {
    // Route set-up and component creation
    TestBed.get(ActivatedRoute).url = of([{path: 'items'}, {path: 'ammo'}]);
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelector('.item-card-container');
    expect(items.querySelector(".item-card-name").textContent).toContain("Ammo/Coating");
    expect(items.querySelector(".item-card-skill")).toBeNull();
  });

  it('should render all items of category consumables successfully', () => {
    // Route set-up and component creation
    TestBed.get(ActivatedRoute).url = of([{path: 'items'}, {path: 'misc'}]);
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelector('.item-card-container');
    expect(items.querySelector(".item-card-name").textContent).toContain("Consumable/Misc");
    expect(items.querySelector(".item-card-skill")).toBeNull();
  });

  it('should render all items of category tools successfully', () => {
    // Route set-up and component creation
    TestBed.get(ActivatedRoute).url = of([{path: 'items'}, {path: 'tools'}]);
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelector('.item-card-container');
    expect(items.querySelector(".item-card-name").textContent).toContain("Specialized Tool");
    expect(items.querySelector(".item-card-skill")).toBeNull();
  });

  it('should render all items of category decoration successfully', () => {
    // Route set-up and component creation
    TestBed.get(ActivatedRoute).url = of([{path: 'items'}, {path: 'deco'}]);
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelector('.item-card-container');
    expect(items.querySelector(".item-card-name").textContent).toContain("Decoration");
    expect(items.querySelector(".item-card-skill")).not.toBeNull();
  });

  it('clicking the search button should toggle the search bar', fakeAsync(() => {
    let searchBtn = fixture.nativeElement.querySelector('.search-btn');
    let searchBar = fixture.nativeElement.querySelector('.tools-search');

    expect(searchBar.classList).not.toContain('search-pulled');
    searchBtn.click();
    
    fixture.detectChanges();
    expect(searchBar.classList).toContain('search-pulled');

  }));

  it('should render search results appropriately', fakeAsync(() => {
    let testSearchItems = createTestItemArrayMultipleOneCat();
   
    dataServiceSpy.getItems.and.returnValue(of(testSearchItems));
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
        
    let searchInput = fixture.nativeElement.querySelector('.search');

    let renderedItems = fixture.nativeElement.querySelectorAll('.item-card-container');
    expect(renderedItems.length).toBe(3);

    searchInput.value = "1";
    searchInput.dispatchEvent(new Event('input')); // Update ngModel
    searchInput.dispatchEvent(new Event('keyup')); // Trigger filter method
    tick();
    fixture.detectChanges();

    renderedItems = fixture.nativeElement.querySelectorAll('.item-card-container');  
    expect(renderedItems.length).toBe(1);
    expect(renderedItems[0].textContent).toContain("1");
  }));

  it('should open an add new item modal when the add item btn is clicked', () => {
    let testInputForModal = {
      isForm: true,
      skills: [testSkill]
    }
    let addItemBtn = fixture.nativeElement.querySelector('.add-btn');

    expect(modalServiceSpy.init).not.toHaveBeenCalled();
    addItemBtn.click();
    expect(modalServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(modalServiceSpy.init).toHaveBeenCalledWith(
      ItemDetailComponent,testInputForModal,{});
  });

  it('editMode should toggle when edit button is clicked', () => {
    let itemElem = fixture.nativeElement.querySelector('.item-card-container');
    let editItemBtn = fixture.nativeElement.querySelector('.edit-btn');

    itemElem.click();
    expect(modalServiceSpy.init).not.toHaveBeenCalled();
    editItemBtn.click();
    itemElem.click();
    expect(modalServiceSpy.init).toHaveBeenCalled();
  });

  it('should open an edit item modal when a particular item is clicked with editMode on', () => { 
    let itemElem = fixture.nativeElement.querySelector('.item-card-container');
    let editItemBtn = fixture.nativeElement.querySelector('.edit-btn');

    let inputForEditClick = {
      item: testItems[0], // testItems[0] is a 'Material' item.
      isForm: true,
      skills: [testSkill]
    }

    editItemBtn.click();
    itemElem.click();

    expect(modalServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(modalServiceSpy.init).toHaveBeenCalledWith(ItemDetailComponent, inputForEditClick, {});
  });

  it('ctrlClick on an item should select it', () => { 
    let testSearchItems = createTestItemArrayMultipleOneCat();
   
    dataServiceSpy.getItems.and.returnValue(of(testSearchItems));
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
        
    let renderedItems = fixture.nativeElement.querySelectorAll('.item-card-container');
    let selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(0);

    // test selecting 1 item out of three.
    renderedItems[0].dispatchEvent(ctrlClickEvent);
    fixture.detectChanges();
    selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(1);

    // test selecting 2 more items for a total of three.
    renderedItems[1].dispatchEvent(ctrlClickEvent);
    renderedItems[2].dispatchEvent(ctrlClickEvent);
    fixture.detectChanges();
    selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(3);

    //deselect 1 for a total of 2.
    renderedItems[1].dispatchEvent(ctrlClickEvent);
    fixture.detectChanges();
    selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(2);
  });

  it('hitting the select button should select all items, likewise for deselect', () => {
    let testSearchItems = createTestItemArrayMultipleOneCat();
   
    dataServiceSpy.getItems.and.returnValue(of(testSearchItems));
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let renderedItems = fixture.nativeElement.querySelectorAll('.item-card-container');
    let selectAllBtn = fixture.nativeElement.querySelector('.select-btn');
    
    selectAllBtn.click();
    fixture.detectChanges();
    let selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(3);

    selectAllBtn.click();
    fixture.detectChanges();
    selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(0);

    renderedItems[0].dispatchEvent(ctrlClickEvent);
    selectAllBtn.click();
    fixture.detectChanges();
    selectedItems = fixture.nativeElement.querySelectorAll('.selected');
    expect(selectedItems.length).toBe(0);    

  });

  it('hitting the delete button should delete all selectedItems on confirm', () => {
    let testSearchItems = createTestItemArrayMultipleOneCat();
   
    dataServiceSpy.getItems.and.returnValue(of(testSearchItems));
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let renderedItems = fixture.nativeElement.querySelectorAll('.item-card-container');
    let selectAllBtn = fixture.nativeElement.querySelector('.select-btn');
    let deleteBtn = fixture.nativeElement.querySelector('.del-btn');

    // Press delete with no selected items
    deleteBtn.click();
    expect(windowSpy).not.toHaveBeenCalled();
    expect(dataServiceSpy.deleteItems).not.toHaveBeenCalled();
    
    // Delete 1 item and confirm with 'yes'
    renderedItems[0].dispatchEvent(ctrlClickEvent);
    windowSpy.and.returnValue(true);
    deleteBtn.click();
    expect(windowSpy).toHaveBeenCalled();
    expect(dataServiceSpy.deleteItems).toHaveBeenCalledTimes(1);

    // Delete 1 item and confirm with 'no'
    renderedItems[0].dispatchEvent(ctrlClickEvent);
    windowSpy.and.returnValue(false);
    deleteBtn.click();
    expect(windowSpy).toHaveBeenCalled();
    expect(dataServiceSpy.deleteItems).not.toHaveBeenCalledTimes(2);
  });

});
