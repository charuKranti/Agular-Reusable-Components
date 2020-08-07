import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  DBDATA=[{"firstName":"Leilani","id":"1550","startDate":"2015/05/27"},{"firstName":"Jemima","id":"7582","startDate":"2015/05/21"},{"firstName":"Hiroko","id":"9368","startDate":"2015/03/13"},{"firstName":"Nathaniel","id":"8331","startDate":"2014/12/05"},{"firstName":"Silas","id":"0746","startDate":"2014/11/13"},{"firstName":"Jermaine","id":"1545","startDate":"2015/03/06"},{"firstName":"Kranti","id":"4395","startDate":"2015/05/22"},{"firstName":"Rama","id":"2973","startDate":"2014/12/01"}];


  public records:Array<any> = [];

  public itemsPerPage:number = 5;
  public totalItems:number = 0;
  public columns:Array<any> = [
    {headerName: 'firstName', title:"FirstName", sort:true, sorting:false },
    {headerName: 'id', title:"JurnyNumber", sort: true, sorting:false},
    {headerName: 'startDate', title:"Start Date", sort: false, sorting:false}
  ];
  public filterBy:any = {
    paging: true,
    searchText: "",
    sortName:"",
    sorting:false,
    checkedValues: [],
    searchColumns:{firstName:"", id:""}
  };

  public constructor() {
    this.totalItems = this.DBDATA.length;
  }

  public ngOnInit() {
    this.onChangeTable();
  }

  addtableRows(data:Array<any> = this.DBDATA):Array<any> {
    let start = 0;
    return data.slice(start, this.itemsPerPage);
  }

  changeSort(data:any):any {
    const { sortName, sorting } = this.filterBy;
    if (!sortName) {
      return data;
    }

    const columns = this.columns || [];
    /* sorting by assceding and descending */
    return data.sort((previous:any, current:any) => {
      if (previous[sortName] > current[sortName]) {
        return !sorting ? -1 : 1;
      } else if (previous[sortName] < current[sortName]) {
        return sorting ? -1 : 1;
      }
      return 0;
    });
  }

  onSearchFilter(data:any):any {
    const { searchText } = this.filterBy;
    let filteredData:Array<any> = [...data];
    if (!searchText) {
      return filteredData;
    }
    /* iterate keys and assign searchtext to key  */
    for (let key in this.filterBy.searchColumns) {
      this.filterBy.searchColumns[key] = searchText
    }

    filteredData = data.filter(item => {
      return Object.keys(this.filterBy.searchColumns).some((keyName) => {
        return new RegExp(this.filterBy.searchColumns[keyName], 'gi').test(item[keyName]) || this.filterBy.searchColumns[keyName] == "";
      });
    })

    return filteredData;
  };

  onFilterBy(): any {

  }

  onChangeTable():any {
    let filteredData = this.onSearchFilter(this.DBDATA);
    let sortedData = this.changeSort(filteredData);
    this.records = this.filterBy.paging ? this.addtableRows(sortedData) : sortedData;
    this.totalItems = sortedData.length;
  }

  loadMoreData(): void {
    if(this.itemsPerPage <= this.records.length) {
      this.itemsPerPage +=5;
      this.onChangeTable();
    }
  }

  /* thir method will fire when click on sortable header column  */
  handleSort(headerColumn) {
    const { headerName } = headerColumn;
    this.filterBy.sortName=headerColumn.headerName;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].headerName === headerName) {
       headerColumn.sorting = !headerColumn.sorting;
       this.filterBy.sorting = headerColumn.sorting;
      } else {
        this.columns[i].sorting = false;
      }
    }
    console.log("HI: ",this.filterBy.sorting);
    this.onChangeTable();
  }
  

}
