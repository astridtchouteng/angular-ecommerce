import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class PopulateFormService {

  private countriesUrl = "http://localhost:8282/api/countries";
  private statesUrl = "http://localhost:8282/api/states";

  constructor(private httpClient: HttpClient) { }

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

  getCountries(): Observable<Country[]> {
    
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getSatesByCountryCode(countryCode: string): Observable<State[]> {

    const searchUrl= `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseState>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }


}


interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}
