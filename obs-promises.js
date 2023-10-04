const { Observable, observable } = require('rxjs')
const { filter } = require('rxjs/operators')

//Solo nos permite emitir un dato 
const doSomething = () => {
    return new Promise((resolve) => {
        /* resolve('valor 1');
        resolve('valor 2'); //este no se emite  */
        setTimeout (() =>{
            resolve ("valor 3");
        }, 3000)
    });
}
 //Observable nos permite emitir diferentes datos con un solo suscribe 
const doSomething$ = () => {
    return new Observable(observer => {
        observer.next('valor 1 $');
        observer.next('valor 2 $');
        observer.next('valor 3 $'); // Todos los datos son emitidos 
        observer.next(null);
        setTimeout (() =>{
            observer.next("valor 4 $");
        }, 5000);
        setTimeout (() =>{
            observer.next(null);
        }, 8000);
        setTimeout (() =>{
            observer.next("valor 5 $");
        }, 10000);
    });
}

(async() => {
    const rta = await doSomething();
    console.log(rta);
})();

(() => {
    const obs$ = doSomething$ ();
    obs$
    .pipe ( 
        filter(value => value !== null)
    )
    .subscribe(rta => {
        console.log(rta);
    })
}) ();