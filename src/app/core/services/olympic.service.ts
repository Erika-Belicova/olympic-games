import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null); // added type

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe( // added type
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error('Error while loading the data.', error); // added message
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  // fetch number of JOs
  fetchNumberOfJOs() {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => {
        return this.getUniqueYearsOfJOs(data);
      }),
      catchError((error) => {
        console.error('Error while fetching data:', error);
        return of(0); // return 0 in case of error
      })
    );
  }

  private getUniqueYearsOfJOs(data: OlympicCountry[] | null): number | null {
    if (!data) return null; // return null if no data
    const yearsOfAllJOs = data.flatMap((country) =>
      country.participations.map((participation) => participation.year));
    return new Set(yearsOfAllJOs).size; // provides the number of unique years of all JOs
  }

  // fetch data for pie chart
  fetchData() {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => 
        data 
          ? data.map((country) => ({
              name: country.country,
              value: this.calculateMedals(country.participations),
          }))
          : [] // return empty array if data is null
      ),
      catchError((error) => {
        console.error('Error while fetching data:', error);
        return of([]); // return empty array in case of error
      })
    );
  }

  // sum of medals per country
  private calculateMedals(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }
}
