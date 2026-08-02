import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  updateSchema(schema: any) {

    const old = document.getElementById('jsonld-schema');

    if (old) {
      old.remove();
    }

    const script = document.createElement('script');

    script.type = 'application/ld+json';

    script.id = 'jsonld-schema';

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

}
