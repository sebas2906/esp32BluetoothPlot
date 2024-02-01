import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor(private bluetoothSerial: BluetoothSerial, private androidPermissions: AndroidPermissions) {

  }

  async isEnabled() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
      result => {
        if (result.hasPermission) {
          //Do nothing and proceed permission exists already
        } else {
          //Request for all the permissions in the array
          this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.BLUETOOTH,
              this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
              this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
              this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
            ])
        }
      },
      err => this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.BLUETOOTH,
          this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
          this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
          this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        ])
    );
    return await this.bluetoothSerial.isEnabled();
  }

  async scan() {
    return await this.bluetoothSerial.list();
  }

  connect(address: string) {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.connect(address).subscribe({
        next: (resp) => {
          console.log('Conexion realizada: ', resp);
          resolve(resp);
        },
        error: (err) => {
          console.log('Error de conexion: ', err);
          reject(err);
        }
      })
    });

  }

  async disconnect() {
    await this.bluetoothSerial.disconnect()
  }

  async isConnected() {
    await this.bluetoothSerial.isConnected();
  }

  async readData() {
    return await this.bluetoothSerial.read();
  }

  async enable() {
    if (await this.isEnabled()) return;
    await this.bluetoothSerial.enable();
  }

  async write(data: string | ArrayBuffer | number[] | Uint8Array) {
    await this.bluetoothSerial.write(data);
  }

  isDatareceived(): Observable<any> {
    return this.bluetoothSerial.subscribe('\n');
  }



}
