import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { Message } from 'primeng/components/common/api';

@Component({
    selector: 'jhi-linechart',
    templateUrl: './linechart.component.html',
    styles: []
})

export class LinechartComponent implements OnInit {
    data: any;
    msgs: Message[];
    chartHeading: string;
    myClass = [];

    constructor() {
        this.chartHeading = 'Messages';
        this.addClass('active');
        this.removeClass('active');
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }

    ngOnInit() {
    }

    addClass(clas) {
        this.myClass.push(clas);
      }

      removeClass(clas) {
        const i = this.myClass.indexOf(clas);
        if (i > -1)  {
            this.myClass.splice(i, 1);
        }
      }

      checkClass() {
        if (this.myClass.indexOf('red') === -1) {
           alert('false');
        } else {
           alert('true');
        }
      }

    getMessages() {
        this.chartHeading = 'Messages';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [22, 55, 88, 88, 66, 55, 44],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }
    getTotalUsers() {
        this.chartHeading = 'Total Users';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [32, 51, 80, 65, 68, 56, 41],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [21, 38, 50, 29, 56, 17, 60],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }
    getUniqueUsers() {
        this.chartHeading = 'Unique Users';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [45, 65, 78, 98, 68, 56, 41],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }
    getSessions() {
        this.chartHeading = 'Sessions';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [24, 45, 28, 58, 60, 25, 84],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }

    selectData(event) {
        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index]});
    }
}
