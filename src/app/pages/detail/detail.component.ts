import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  countryName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
  }
}
