import { asyncComponent } from '../utils/asyncComponent';

const Index = asyncComponent(() => import('../components/containers/index/Index'));
const List = asyncComponent(() => import('../components/containers/list/List'));
