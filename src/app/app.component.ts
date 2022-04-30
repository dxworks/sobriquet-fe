import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {LoadingService} from './services/request.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loading: boolean;

  constructor(private elementRef: ElementRef,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.listenToLoading()
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#FFFFFF';
  }
}
