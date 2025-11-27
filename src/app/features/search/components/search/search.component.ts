import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  searchResults: any[] = [];
  isSearching = false;
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: [''],
      country: [''],
      tag: ['']
    });

    // Watch for search input changes
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length >= 3) {
          this.performSearch();
        }
      });
  }

  performSearch(): void {
    this.isSearching = true;
    this.hasSearched = true;

    const { query, country, tag } = this.searchForm.value;

    let searchUrl = 'https://de1.api.radio-browser.info/json/stations/search?';
    const params: string[] = [];

    if (query) params.push(`name=${encodeURIComponent(query)}`);
    if (country) params.push(`country=${encodeURIComponent(country)}`);
    if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
    params.push('limit=50');
    params.push('order=votes');
    params.push('reverse=true');

    searchUrl += params.join('&');

    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        this.searchResults = data.map((station: any) => ({
          ...station,
          name: station.name.trim()
        }));
        this.isSearching = false;
      })
      .catch(error => {
        console.error('Search error:', error);
        this.isSearching = false;
      });
  }

  playStation(station: any): void {
    // Navigate to player with station data
    this.router.navigate(['/player'], { 
      state: { station } 
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchResults = [];
    this.hasSearched = false;
  }
}