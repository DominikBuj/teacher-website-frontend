import {animate, animateChild, animation, group, query, state, style, transition, trigger, useAnimation} from '@angular/animations';

const easeInVerticalAnimation = animation([
  style({height: '0'}),
  animate('1s ease-in-out', style({height: '*'}))
]);

const easeOutVerticalAnimation = animation([
  style({height: '*'}),
  animate('1s ease-in-out', style({height: '0'}))
]);

/*const easeInHorizontalAnimation = animation([
  style({width: '0'}),
  animate('1s ease-in-out', style({width: '*'}))
]);

const easeOutHorizontalAnimation = animation([
  style({width: '*'}),
  animate('1s ease-in-out', style({width: '0'}))
]);*/

const easeInOpacityAnimation = animation([
  style({opacity: '0'}),
  animate('{{ timings }}', style({opacity: '1'}))
]);

const easeOutOpacityAnimation = animation([
  style({opacity: '1'}),
  animate('{{ timings }}', style({opacity: '0'}))
]);

const animateChildrenQuery = query('@*', animateChild(), {optional: true});

const verticalEditingContainerAnimation = animation([
  style({
    height: '{{startHeight}}'
  }),
  animate('1s ease-in-out', style({
    height: '{{endHeight}}'
  }))
]);

/*trigger('easeInOutVerticalEditingContainer', [
  state('collapsed, void', style({height: '0', minHeight: '0', display: 'none'})),
  state('expanded', style({height: '*', minHeight: '100px'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
])*/
export const Animations = {
  easeInOutVerticalEditingContainer: trigger('easeInOutVerticalEditingContainer', [
    transition(':enter', [
      group([
        animateChildrenQuery,
        easeInVerticalAnimation
      ])
    ]),
    transition(':leave', [
      group([
        animateChildrenQuery,
        easeOutVerticalAnimation
      ])
    ]),
  ]),
  easeInOutEditingButton: trigger('easeInOutEditingButton', [
    transition('void => *', [
      useAnimation(easeInOpacityAnimation, {
        params: {
          timings: '500ms 500ms ease-in-out'
        }
      })
    ]),
    transition('* => void', [
      useAnimation(easeOutOpacityAnimation, {
        params: {
          timings: '500ms ease-in-out'
        }
      })
    ])
  ]),
  expandCollapseDissertationDescription: trigger('expandCollapseDissertationDescription', [
    state('collapsed, void', style({
      height: 0,
      padding: '0'
    })),
    state('expanded', style({
      height: '*',
      padding: '8px 0'
    })),
    transition('collapsed <=> expanded', [
      animate('500ms ease-in-out')
    ])
  ])
};
