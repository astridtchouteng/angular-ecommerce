import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopulateFormService {

  constructor() { }

  getMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // start at current month until december
    for (let theMonth = startMonth; theMonth<=12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getYears(): Observable<number[]> {

    let data: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for(let theYear= startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);

  }
}
