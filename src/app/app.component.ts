import {AuthService} from './_services/auth.service';
import {Teacher} from './_models/teacher.model';
import {TeacherService} from './_services/teacher.service';
import {GlobalService} from './_services/global.service';
import {SettingsService} from './_services/settings.service';
import {FunctionsService} from './_services/functions.service';
import {Details} from './_models/details.model';
import {DetailsService} from './_services/details.service';
import {HttpClient} from '@angular/common/http';
import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Constants} from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'TeacherWebsite';
  teacher: Teacher = null;
  details: Details = null;
  readonly lightSiteLogoUrl = Constants.SITE_LOGO_LIGHT_URL;
  readonly darkSiteLogoUrl = Constants.SITE_LOGO_DARK_URL;
  readonly siteBackgroundUrl = `${Constants.BACKGROUNDS_URL}/background_`;
  lightBackgroundUrl: string = null;
  darkBackgroundUrl: string = null;
  backgroundIndexes = [1, 2, 3, 4, 5];
  private readonly screenBreakpointSmall: string = '(max-width: 639px)';
  private readonly screenBreakpointMedium: string = '(min-width: 640px) and (max-width: 959px)';
  private readonly screenBreakpointLarge: string = '(min-width: 960px) and (max-width: 1439px)';
  private readonly screenBreakpointVeryLarge: string = '(min-width: 1440px)';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private overlayContainer: OverlayContainer,
    private http: HttpClient,
    public global: GlobalService,
    private auth: AuthService,
    public settings: SettingsService,
    private teacherService: TeacherService,
    private detailsService: DetailsService,
    private functions: FunctionsService,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  switchDarkModeClass(isDarkMode: boolean): void {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    if (isDarkMode) {
      overlayContainerClasses.add('dark-mode');
    } else {
      overlayContainerClasses.remove('dark-mode');
    }
  }

  setBackgroundUrl(mode: 'light' | 'dark', url: string): void {
    if (mode === 'light') {
      this.http.get(url, {responseType: 'blob'}).subscribe(
        response => {
          if (!!response && this.lightBackgroundUrl !== url) {
            this.lightBackgroundUrl = url;
          } else if (!!this.lightBackgroundUrl) {
            this.lightBackgroundUrl = null;
          }
        }
      );
    } else {
      this.http.get(url, {responseType: 'blob'}).subscribe(
        response => {
          if (!!response && this.darkBackgroundUrl !== url) {
            this.darkBackgroundUrl = url;
          } else if (!!this.darkBackgroundUrl) {
            this.darkBackgroundUrl = null;
          }
        }
      );
    }
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      this.screenBreakpointSmall,
      this.screenBreakpointMedium,
      this.screenBreakpointLarge,
      this.screenBreakpointVeryLarge
    ]).subscribe((state: BreakpointState) => {
      this.global.isScreenSmall = this.breakpointObserver.isMatched(this.screenBreakpointSmall);
      this.global.isScreenMedium = this.breakpointObserver.isMatched(this.screenBreakpointMedium);
      this.global.isScreenLarge = this.breakpointObserver.isMatched(this.screenBreakpointLarge);
      this.global.isScreenVeryLarge = this.breakpointObserver.isMatched(this.screenBreakpointVeryLarge);
    });

    this.switchDarkModeClass(this.global.isDarkMode);

    this.teacherService.teacher.subscribe((teacher: Teacher) => this.teacher = teacher);
    this.detailsService.details.subscribe((details: Details) => {
      if (!!details) {
        this.details = details;
        if (!!details.lightBackgroundUrl) {
          this.setBackgroundUrl('light', details.lightBackgroundUrl);
        }
        if (!!details.darkBackgroundUrl) {
          this.setBackgroundUrl('dark', details.darkBackgroundUrl);
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  switchDarkMode(): void {
    this.switchDarkModeClass(!this.global.isDarkMode);
    this.settings.switchDarkMode();
  }

  getCssBackgroundImage(mode: 'light' | 'dark'): string {
    if (mode === 'light') {
      return !!this.lightBackgroundUrl ? 'url(' + this.lightBackgroundUrl + ')' : null;
    }
    return !!this.darkBackgroundUrl ? 'url(' + this.darkBackgroundUrl + ')' : null;
  }

  setBackground(mode: 'light' | 'dark', backgroundIndex: number): void {
    let detailsKey: 'lightBackgroundUrl' | 'darkBackgroundUrl';
    let detailsForm: any;
    if (mode === 'light') {
      detailsKey = 'lightBackgroundUrl';
      const lightBackgroundUrl = `${Constants.BACKGROUNDS_URL}/background_light_${backgroundIndex}_large.jpg`;
      detailsForm = {lightBackgroundUrl};
    } else {
      detailsKey = 'darkBackgroundUrl';
      const darkBackgroundUrl = `${Constants.BACKGROUNDS_URL}/background_dark_${backgroundIndex}_large.jpg`;
      detailsForm = {darkBackgroundUrl};
    }

    const detailsUpdate = this.functions.createModelUpdate<Details>(
      [detailsKey],
      detailsForm,
      !!this.details ? this.details : {lightBackgroundUrl: null, darkBackgroundUrl: null} as Details
    );
    this.detailsService.updateDetails(detailsUpdate).subscribe();
  }

  logout(): void {
    this.auth.logout();
  }
}
