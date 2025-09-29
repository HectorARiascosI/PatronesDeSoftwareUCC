export class DoublyNode<T> {
  data: T;
  prev: DoublyNode<T> | null = null;
  next: DoublyNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;
  length = 0;

  // Agrega al final
  append(data: T) {
    const newNode = new DoublyNode(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  // Elimina según una función de comparación
  remove(compareFn: (data: T) => boolean) {
    let current = this.head;
    while (current) {
      if (compareFn(current.data)) {
        if (current.prev) current.prev.next = current.next;
        else this.head = current.next;

        if (current.next) current.next.prev = current.prev;
        else this.tail = current.prev;

        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  // Convierte la lista a array
  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  // Vacía la lista
  clear() {
    this.head = this.tail = null;
    this.length = 0;
  }
}