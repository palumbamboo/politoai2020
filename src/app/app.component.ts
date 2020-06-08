import {Component, ViewChild} from '@angular/core';
import {StudentModel} from "./student.model";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

export interface User {
  name: string;
}

const studentDb: StudentModel[] = [
  new StudentModel("1", "Daniele", "Palumbo"),
  new StudentModel("2", "Giulia", "Milan"),
  new StudentModel("3", "Francensco", "Pavan"),
  new StudentModel("4", "Simone", "Magnani"),
  new StudentModel("5", "Riccardo", "Marchi"),
  new StudentModel("6", "Enrico", "Postolov"),
  new StudentModel("7", "Ilaria", "Di Domenico"),
  new StudentModel("8", "Simone", "Peraccini"),
  new StudentModel("9", "Federica", "Leone"),
  new StudentModel("10", "Simona", "Rota"),
  new StudentModel("11", "Milah", "Frigatti"),
  new StudentModel("12", "Marco", "Rossi"),
  new StudentModel("13", "Ludovico", "De Paperoni")
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ai20-lab04';
  displayedColumns: string[] = ['select', 'id', 'name', 'firstName'];

  dataSource = new MatTableDataSource<StudentModel>(this.randomStudents(5));
  selection = new SelectionModel<StudentModel>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  randomStudents(n) {
    let studentsCopy = [...studentDb]
    // Shuffle array
    const shuffled = studentsCopy.sort(() => 0.5 - Math.random());

// Get sub-array of first n elements after shuffled
    return shuffled.slice(0, n);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: StudentModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  removeStudentsSelected() {
    if (!this.selection.isEmpty()) {
      for(const student in this.selection.selected) {
        this.dataSource.data.splice(this.dataSource.data.indexOf(this.selection.selected[student]),1);
      }
      this.selection = new SelectionModel<StudentModel>(true, []);
      this.dataSource = new MatTableDataSource<StudentModel>(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  myControl = new FormControl();
  options: StudentModel[] = studentDb
  filteredOptions: Observable<StudentModel[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  displayFn(student: StudentModel): string {
    return student ? student.name + ' ' + student.firstName + ' (' + student.id + ')' : ''
  }

  private _filter(name: string): StudentModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  addStudentToTable() {
    if(!this.dataSource.data.includes(this.myControl.value) && this.myControl.value) {
      this.dataSource.data.push(this.myControl.value)
      this.dataSource = new MatTableDataSource<StudentModel>(this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    this.myControl.setValue('')
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

}
