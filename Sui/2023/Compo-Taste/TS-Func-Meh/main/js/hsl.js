import { Leaf } from "./meh/index.js";
const log = console.log;
//  //
/*

vdef HSL
{
    hue : number ;
    sat : number ;
    lig : number ;

    @ rel css : string ;

    @ update( { hue, sat, lig } )
    {
        return { css: `hsl( ${ hue }, ${ sat * 100 }%, ${ lig * 100 }% )` }
    }

    @ def : {  hue: 180, sat: 0.7. lig: 0.7 }
}


*/
class Value {
    hue;
    sat;
    lig;
    constructor(iv) {
        const rel = () => this.update();
        this.hue = Leaf.Number.make(iv.hue ?? 195);
        this.sat = Leaf.Number.make(iv.sat ?? 0.7);
        this.lig = Leaf.Number.make(iv.lig ?? 0.7);
    }
    update() {
        ;
    }
}
export const HSL = { Value };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHNsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMtc3JjL2hzbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV4QixNQUFNO0FBRU47Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkU7QUFFRixNQUFNLEtBQUs7SUFFVixHQUFHLENBQXFCO0lBQ3hCLEdBQUcsQ0FBcUI7SUFDeEIsR0FBRyxDQUFxQjtJQUV4QixZQUFhLEVBQVU7UUFFdEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBRSxDQUFDO0lBQzlDLENBQUM7SUFFTyxNQUFNO1FBRWIsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDIn0=