import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  //this will create the user_settings if it is not already present.
  //user_settings is required for this app
  seedDb() {
    const db = {
      name: 'user_settings',
    };
    this.createDb(db).subscribe((val) => {
      console.log(val);
    });
  }

  createDb(body: Object) {
    const url = 'http://localhost:8000/create';
    return this.httpClient.post(url, body).pipe(
      catchError((err) => {
        console.log('error caught in service for createDb');
        console.error(err);

        return throwError(() => err); //Rethrow it back to component
      })
    );
  }

  getDb() {
    const url = 'http://localhost:8000/';
    return this.httpClient.get(url).pipe(
      catchError((err) => {
        console.log('error caught in service for getDb');
        console.error(err);

        return throwError(() => err); //Rethrow it back to component
      })
    );
  }

  insertData(body: Object) {
    const url = 'http://localhost:8000/add';
    return this.httpClient.post(url, body).pipe(
      catchError((err) => {
        console.log('error caught in service for insertData');
        console.error(err);

        return throwError(() => err); //Rethrow it back to component
      })
    );
  }

  getData() {
    const url = 'http://localhost:8000/getData';
    return this.httpClient.get(url).pipe(
      catchError((err) => {
        console.log('error caught in service for getData');
        console.error(err);

        return throwError(() => err); //Rethrow it back to component
      })
    );
  }
}
