import 'regenerator-runtime/runtime';
import { configure,  shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });