import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class WorkerService {

  private saveWorker(workers: any[]): void {
    try {
      fs.writeFileSync('./src/worker.json', JSON.stringify(workers, null, 2));
    } catch (error) {
      throw new Error(`Une erreur s'est produite lors de l'écriture dans le fichier : ${error.message}`);
    }
  }

  // findAll(): any[] {
  //   try {
  //     const fileContent = fs.readFileSync('./src/worker.json', 'utf8');
  //     const workers = JSON.parse(fileContent);
  //     return workers;
  //   } catch (error) {
  //     throw new Error(`Une erreur s'est produite lors de la lecture du fichier : ${error.message}`);
  //   }
  // }
  findAll(): any[] {
    try {
      // Vérifier si le fichier existe avant de le lire
      if (!fs.existsSync('./src/worker.json')) {
        return []; // Retourner un tableau vide si le fichier n'existe pas
      }

      const fileContent = fs.readFileSync('./src/worker.json', 'utf8');
      const workers = JSON.parse(fileContent);
      return workers;
    } catch (error) {
      throw new Error(`Une erreur s'est produite lors de la lecture du fichier : ${error.message}`);
    }
  }

  findById(id: string) : any {
    const workers = this.findAll();
    const worker = workers.find(w => w.employee_id === id);
    if (!worker) {
      throw new Error(`Aucun travailleur trouvé avec l'ID : ${id}`);
    }
    return worker;
  }
  update(id: string, newData: any): void {
    const workers = this.findAll();
    const index = workers.findIndex(worker => worker.employee_id === id);
    if (index !== -1) {
      workers[index] = { ...workers[index], ...newData };
      this.saveWorker(workers);
    } else {
      throw new Error(`Aucun travailleur trouvé avec l'ID : ${id}`);
    }
  }

  create(newWorkerData: any): void {
    const workers = this.findAll();
    workers.push(newWorkerData);
    this.saveWorker(workers);
  }

  delete(id: string): void {
    let workers = this.findAll();
    const initialLength = workers.length;
    workers = workers.filter(worker => worker.employee_id !== id);
    if (workers.length < initialLength) {
      this.saveWorker(workers);
    } else {
      throw new Error(`Aucun travailleur trouvé avec l'ID : ${id}`);
    }
  }
}
