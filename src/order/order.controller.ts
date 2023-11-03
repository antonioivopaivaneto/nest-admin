import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {Response}from 'express';
import { Parser } from 'json2csv';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@UseGuards(AuthGuard)
@Controller()
export class OrderController {
    constructor(private orderService:OrderService){}

    @Get('orders')
    async all(@Query('page') page=1){
        return this.orderService.paginate(page,['order_items']);

    }

    @Post('export')
    async export(@Res() res: Response){

        
        const parse =new  Parser({
            fields: ['ID', 'Name','Email', 'product Title', 'Price','Quantity']
        });

        const orders = await this.orderService.all(['order_items'])


        const json = [];

        orders.forEach((o:Order) =>{
            json.push({
            ID: o.id,
            Name:o.first_name,
            Email: o.email,
            'Product title':'',
            Price:'',
            quantity:''

        });

        o.order_items.forEach((i: OrderItem) =>{
            json.push({
                ID: '',
                Name:'',
                Email: '',
                'Product title':i.product_title,
                Price:i.price,
                quantity:i.quantity
    
            });

        });
        });

        const csv = parse.parse(json);
        res.header('Content-Type','text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }
  
    

    @Get('chart')
    async chart(){
        return this.orderService.chart()
    }
    
    
}
