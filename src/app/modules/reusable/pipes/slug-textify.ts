import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textify' })
export class SlugTextifyPipe implements PipeTransform {
  transform(slug: string, exponent?: number): string {
    const replacer = (v) => v.toUpperCase();
    return slug
      .replace('-', ' ')
      .replace(/(^[a-z])/, replacer)
      .replace(/(\s[a-z])/, replacer);
  }
}
