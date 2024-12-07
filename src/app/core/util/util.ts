import {HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import * as XLSX from "xlsx";


export function handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
        }`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
}

export function exportToCSV(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const csvData: string = XLSX.utils.sheet_to_csv(worksheet);
    const blob: Blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const currentDate = new Date().toISOString().split('T')[0];
    link.download = `${fileName}_${currentDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}