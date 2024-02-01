import { Component, ViewChild } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { BluetoothClassicSerialPortDevice } from '@awesome-cordova-plugins/bluetooth-classic-serial-port';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  is_enabled = false;
  devices: BluetoothClassicSerialPortDevice[] = [];
  title = 'ng2-charts-demo';
  logs = '';

  max_data_length = 100;

  indice = 0;

  device_address: string = '';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Presión (KPa)',
        fill: false,
        tension: 0,
        borderColor: 'white'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    elements: {
      point: {
        radius: 0
      }
    },
    animation: false
  };
  public lineChartLegend = true;

  constructor(private bluetoothService: BluetoothService) {
    this.init();
    this.bluetoothService.isDatareceived().subscribe((data) => {
      //console.log(data);
      this.printData(Number(data));
      this.chart?.update();
    });
    // this.generateRandomData();
  }

  async init() {
    this.is_enabled = await this.bluetoothService.isEnabled();
  }

  async scanDevices() {
    this.checkConnection();
    if (!this.is_enabled) return;
    this.is_enabled = await this.bluetoothService.isEnabled();
    this.devices = await this.bluetoothService.scan();
    console.log('Dispositivos: ', this.devices);
  }

  async checkConnection() {
    await this.bluetoothService.enable();
    this.is_enabled = await this.bluetoothService.isEnabled();
    if (this.is_enabled) {
      console.log('Conexion activa')
    } else {
      console.log('Conexion desactivada')
    }
  }

  async connectDevice(address: string | undefined) {
    if (!address) return;
    this.device_address = address;
    await this.bluetoothService.connect(address).then(resp => {
      this.logs = `Dispositivo conectado correctamente`;
    }).catch((err)=>{
      this.logs = `Error al conectar dispositivo`;
    });
  }

  generateRandomData() {
    // for (let i = 0; i < 1000; i++) {
    setInterval(() => {
      let data = Math.sin(this.indice * 0.1);
      this.printData(data);
      this.indice++;
      this.chart?.update();
      // console.log(this.lineChartData)
    }, 10);
    //  }
  }

  printData(data: number) {
    if (this.lineChartData.datasets[0].data.length >= this.max_data_length) {
      this.shiftArray(this.lineChartData.datasets[0].data as number[], this.lineChartData.labels as number[], data);
      return;
    }
    //render labels
    this.lineChartData.datasets[0].data.push(data);
    if (this.lineChartData.labels?.length == 0) {
      this.lineChartData.labels = [];
      this.lineChartData.labels.push(0);
    } else {
      this.lineChartData.labels?.push((this.lineChartData.labels[this.lineChartData.labels.length - 1] as number) + 1);
    }
  }

  shiftArray(data: number[], labels: number[], next: number) {
    if (!data.length || !labels.length) return data;
    for (let i = 1; i < data.length; i++) {
      data[i - 1] = data[i];
      labels[i - 1] = labels[i];
    }
    data[data.length - 1] = next;
    labels[labels.length - 1] = labels[labels.length - 1] + 1;
    return data;
  }


}
