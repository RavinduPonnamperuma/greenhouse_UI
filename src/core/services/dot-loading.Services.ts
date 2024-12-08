import {Injectable, signal} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DotLoadingServices {
    isLoading = signal(false);

    setLoading(loading: boolean) {
        this.isLoading.set(loading);
    }
}