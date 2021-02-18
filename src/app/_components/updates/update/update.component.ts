import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FunctionsService} from '../../../_services/functions.service';
import {Update} from '../../../_models/update.model';
import {UpdateService} from '../../../_services/update.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  id: number;
  update: Update;
  operation: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public functions: FunctionsService,
    private updateService: UpdateService
  ) {
    this.update = new Update(undefined, undefined, undefined, undefined, undefined);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params?.id;
      if (id) {
        this.id = id;
        this.operation = 'Edytuj';
        this.updateService.getUpdate(this.id).subscribe((update: Update) => this.update = update);
      }
      else {
        this.operation = 'Dodaj';
      }
    });
  }

  onSubmit(): void {
    if (this.operation) {
      this.update.date = new Date().getTime();
      if (this.operation === 'Dodaj') {
        this.updateService.addUpdate(this.update).subscribe(_ => this.router.navigate(['updates']));
      }
      else {
        this.updateService.replaceUpdate(this.update).subscribe(_ => this.router.navigate(['updates']));
      }
    }
  }
}
