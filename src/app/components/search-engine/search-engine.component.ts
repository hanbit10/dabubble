import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-engine.component.html',
  styleUrl: './search-engine.component.scss',
})
export class SearchEngineComponent implements OnInit {
  setUserSearchBar($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
  contents: any;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {}
}
