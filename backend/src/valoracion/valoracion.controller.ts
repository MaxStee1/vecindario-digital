import { Controller, Get, Delete, Put, Post, Body, Param } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';

@Controller('valoracion')
export class ValoracionController {

  constructor(private readonly valoracionService: ValoracionService) {}

  @Get()
  getValoraciones() {
    return this.valoracionService.getValoraciones();
  }

  @Post()
  createValoracion(@Body() createValoracionDto: CreateValoracionDto) {
    return this.valoracionService.createValoracion(createValoracionDto);
  }

  @Put(':id')
  updateValoracion(@Param('id') valoracionId:string, @Body() updateValoracionDto: UpdateValoracionDto) {
    return this.valoracionService.updateValoracion(Number(valoracionId), updateValoracionDto);
  }

  @Delete(':id')
  deleteValoracion(@Param('id') valoracionId: string) {
    return this.valoracionService.deleteValoracion(Number(valoracionId));
  }

}
