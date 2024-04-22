  import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, BadRequestException} from '@nestjs/common';
  import { WorkerService } from './worker.service';
  import axios from 'axios';
import { AuthGuard } from './guard/worker.guard';


  @Controller()
  export class WorkerController {
    constructor(private readonly workerService: WorkerService) {}
    
    // @Get('/workers/:id')
    // findOne(@Param('id') id: string): any {
    //   try {
    //     return this.workerService.findById(id);
    //   } catch (error) {
    //     throw new BadRequestException(error.message);
    //   }
    // }

    @Get('/workers')
    @UseGuards(AuthGuard)
    async getWorkers(@Request() req): Promise<any[]> {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Token non fourni.');
      }
      try {
        // Appel vers le serveur d'introspection pour valider le token
        const introspectionResponse = await axios.get(`http://localhost:4500/introspect?token=${token}`);
        const introspectionData = introspectionResponse.data;

        // Si le token est valide, vous pouvez renvoyer les travailleurs
        if (introspectionData.success) {
          return this.workerService.findAll();
        } else {
          throw new Error('Token invalide.');
        }
      } catch (error) {
        throw new Error(`Erreur lors de la validation du token : ${error.message}`);
      }
  }

    @Get('/workers/:id')
    getWorkerById(@Param('id') id: string): any {
      return this.workerService.findById(id);
    }

    @Put('/workers/:id')
    updateWorker(@Param('id') id: string, @Body() data: any): void {
      this.workerService.update(id, data);
    }

    @Post('/workers')
    createWorker(@Body() data: any): void {
      this.workerService.create(data);
    }

    @Delete('/workers/:id')
    deleteWorker(@Param('id') id: string): void {
      this.workerService.delete(id);
    }
  }
