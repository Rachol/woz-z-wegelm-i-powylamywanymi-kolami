import { Injectable } from '@angular/core';

@Injectable()
export class FlashMessagesServiceStub {
    msg: string;
    options: any;

    show(msg: string, options: any) {
        this.msg = msg;
        this.options = options;
    }
}
