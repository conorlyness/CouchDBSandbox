import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dbList: any[] = [];
  dbData!: any;
  results: any[] = [];

  dbName = new FormControl('');

  userDetailsForm!: FormGroup;

  favColour!: any;
  noOfPets!: any;
  carManufacturer!: any;
  age!: any;
  wearsGlasses!: any;
  gamer!: any;
  footballTeam!: any;

  constructor(private apiService: ApiService, fb: FormBuilder) {
    this.userDetailsForm = fb.group({
      favColour: ['', Validators.required],
      noOfPets: ['', Validators.required],
      carManufacturer: ['', Validators.required],
      age: ['', Validators.required],
      //purposely have some more inputs that are not required so the user_settings db can vary from amount of info
      wearsGlasses: [''],
      gamer: [''],
      footballTeam: [''],
    });

    this.favColour = this.userDetailsForm.controls['favColour'];
    this.noOfPets = this.userDetailsForm.controls['noOfPets'];
    this.carManufacturer = this.userDetailsForm.controls['carManufacturer'];
    this.age = this.userDetailsForm.controls['age'];
    this.wearsGlasses = this.userDetailsForm.controls['wearsGlasses'];
    this.gamer = this.userDetailsForm.controls['gamer'];
    this.footballTeam = this.userDetailsForm.controls['footballTeam'];
  }

  ngOnInit() {
    this.getListOfDbs();
    //look in couchDB for previously defined settings
    this.getFromCouch();
  }

  getListOfDbs() {
    let requiredDb = 'user_settings';
    this.apiService.getDb().subscribe((val: any) => {
      this.dbList = val;
      console.log(this.dbList);
      let isRequiredDbPresent = this.dbList.filter((el: any) => {
        return el === requiredDb;
      });

      if (isRequiredDbPresent.length > 0) {
        console.log('user_settings is present in couch');
      } else {
        console.log('need to seed db');
        this.apiService.seedDb();
      }
    });
  }

  colour!: string;
  pets!: string;
  car!: string;
  personsAge!: string;
  glasses!: string;
  isGamer!: string;
  footy!: string;

  addToCouch() {
    let objToAdd: any = {};

    this.colour = this.favColour.value;
    this.pets = this.noOfPets.value;
    this.car = this.carManufacturer.value;
    this.personsAge = this.age.value;
    this.glasses = this.wearsGlasses.value;
    this.isGamer = this.gamer.value;
    this.footy = this.footballTeam.value;

    if (this.favColour.value) objToAdd['favColour'] = this.favColour.value;
    if (this.noOfPets.value) objToAdd['noOfPets'] = this.noOfPets.value;
    if (this.carManufacturer.value)
      objToAdd['carManufacturer'] = this.carManufacturer.value;
    if (this.age.value) objToAdd['age'] = this.age.value;
    if (this.wearsGlasses.value)
      objToAdd['wearsGlasses'] = this.wearsGlasses.value;
    if (this.gamer.value) objToAdd['gamer'] = this.gamer.value;
    if (this.footballTeam.value)
      objToAdd['footballTeam'] = this.footballTeam.value;

    console.log('going to be adding this object of user details to couch: ');
    console.log(objToAdd);
    console.log('----------------------------------');

    this.userDetailsForm.reset();

    this.apiService.insertData(objToAdd).subscribe((val) => {
      console.log('the response from the server:');
      console.log(val);
    });
  }

  getFromCouch() {
    this.colour = '';
    this.pets = '';
    this.car = '';
    this.personsAge = '';
    this.glasses = '';
    this.isGamer = '';
    this.footy = '';
    this.results = [];
    this.apiService.getData().subscribe((val) => {
      console.log(val);

      if (val) {
        for (let [key, value] of Object.entries(val)) {
          const obj = {
            property: key,
            value: value,
          };
          this.results.push(obj);
        }
      }

      this.dbData = val;
      if (this.dbData?.favColour) {
        this.colour = this.dbData.favColour;
      }
      if (this.dbData?.noOfPets) {
        this.pets = this.dbData.noOfPets;
      }
      if (this.dbData?.carManufacturer) {
        this.car = this.dbData.carManufacturer;
      }
      if (this.dbData?.age) {
        this.personsAge = this.dbData.age;
      }
      if (this.dbData?.wearsGlasses) {
        this.glasses = this.dbData.wearsGlasses;
      }
      if (this.dbData?.gamer) {
        this.isGamer = this.dbData.gamer;
      }
      if (this.dbData?.footballTeam) {
        this.footy = this.dbData.footballTeam;
      }
    });
  }

  //not needed right now
  // addMoreToCouchThanUsual() {
  //   const objToAdd = {
  //     favColour: 'Red',
  //     noOfPets: '2',
  //     carMake: 'Renault',
  //     age: '23',
  //     glasses: 'Yes',
  //     gamer: 'ofcourse!',
  //     more: 'test',
  //     more2: 'test2'
  //   };

  //   this.apiService.insertData(objToAdd).subscribe((val) => {
  //     console.log('the response from the server:');
  //     console.log(val);
  //   });
  // }

  createDB() {
    console.log('going to create a db with name: ', this.dbName.value);
    this.apiService.createDb({ name: this.dbName.value }).subscribe();
  }

  fetchDbList() {
    this.apiService.getDb().subscribe((val: any) => {
      this.dbList = val;
    });
  }
}
