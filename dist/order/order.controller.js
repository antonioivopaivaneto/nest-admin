"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const auth_guard_1 = require("../auth/auth.guard");
const json2csv_1 = require("json2csv");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async all(page = 1) {
        return this.orderService.paginate(page, ['order_items']);
    }
    async export(res) {
        const parse = new json2csv_1.Parser({
            fields: ['ID', 'Name', 'Email', 'product Title', 'Price', 'Quantity']
        });
        const orders = await this.orderService.all(['order_items']);
        const json = [];
        orders.forEach((o) => {
            json.push({
                ID: o.id,
                Name: o.first_name,
                Email: o.email,
                'Product title': '',
                Price: '',
                quantity: ''
            });
            o.order_items.forEach((i) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product title': i.product_title,
                    Price: i.price,
                    quantity: i.quantity
                });
            });
        });
        const csv = parse.parse(json);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }
    async chart() {
        return this.orderService.chart();
    }
};
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "all", null);
__decorate([
    (0, common_1.Post)('export'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "export", null);
__decorate([
    (0, common_1.Get)('chart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "chart", null);
OrderController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map