import { Component } from '@angular/core'
import { MatExpansionModule } from '@angular/material/expansion'

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {}
