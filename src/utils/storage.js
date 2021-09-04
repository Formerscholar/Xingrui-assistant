var storage={
    set(key,value){
        if(typeof arr=='object')
            localStorage.setItem(key,JSON.stringify(value))
        else
            localStorage.setItem(key,value)
    },
    get(key){
        return localStorage.getItem(key)
    },
    remove(key){
        localStorage.removeItem(key)
    }
}
 
export default storage;