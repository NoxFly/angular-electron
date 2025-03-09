import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-article-list',
    standalone: true,
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ArticleListComponent {
}
