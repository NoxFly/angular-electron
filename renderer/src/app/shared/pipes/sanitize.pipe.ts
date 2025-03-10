import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

// http://szumiato.pl/2017/03/23/angular-2-sanitizer-debounce/

/**
 * Cette classe SanitizePipe est un "Pipe" personnalisé dans Angular qui permet de désinfecter
 * le contenu avant de l'insérer dans le DOM de l'application. C'est crucial pour prévenir les
 * attaques XSS (Cross-Site Scripting) en s'assurant que le contenu inséré est sûr et ne
 * contient pas de scripts malveillants.
 *
 * Quand l'utiliser ?
 *
 * Vous devriez utiliser SanitizePipe chaque fois que vous avez besoin d'insérer du contenu dynamique
 * qui provient d'une source externe ou non fiable.
 * Par exemple, du contenu HTML, des styles, des scripts, des URL ou des URL de ressources qui sont
 * générés par l'utilisateur ou proviennent d'une API externe.
 *
 * Comment l'utiliser ?
 *
 * 1. Importez Sanitize pipe dans votre module
 * 2. Utilisez Sanitize pipe dans vos templates, par exemple :
 * <div [innerHTML]="someHtmlContent | sanitize:'html'"></div>
 */
@Pipe({
    name: 'sanitize',
    standalone: true,
})
export class SanitizePipe implements PipeTransform {

    constructor(private readonly sanitizer: DomSanitizer) {}

    /**
     * @description
     * Transforme la valeur en un objet sécurisé en fonction du type spécifié.
     */
    public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch(type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Unable to bypass security for invalid type: ${type}`);
        }
    }

}
