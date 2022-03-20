export class UtilService {

    static generateRandomString(length: number = 64) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static stringDate(date: Date) {
        const d = date;
        return `${this.dateNumber(d.getDate())}${this.dateNumber(d.getMonth() + 1)}${d.getFullYear()}_`
            + `${this.dateNumber(d.getHours())}${this.dateNumber(d.getMinutes())}${this.dateNumber(d.getSeconds())}`;
    }

    /* 6 -> 06 */
    static dateNumber(number: number):string {
        if (number < 10) {
            return `0${number}`;
        }

        return '' + number;
    }

    static daysInMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    }

}