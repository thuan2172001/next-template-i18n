import * as numeral from 'numeral';

export default (number) => {

    if (number >= 1000) {

        let check = (number) => {

            if (
                number < 1000000 
                && Math.ceil(number / 100) % 10 == 0
            ) return true;
            
            if (
                number >= 1000000 
                && number < 1000000000
                && Math.ceil(number / 100000) % 10 == 0
            ) return true;
            
            if (Math.ceil(number / 100000000) % 10 == 0) return true;
            
            return false;
        }   

        if (check(number)) return numeral(number).format('0a');
        
        return numeral(number).format('0.0a');

    }

    return number;
}
