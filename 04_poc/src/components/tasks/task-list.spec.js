import { scryRenderedComponentsWithType } from 'react-addons-test-utils';
import { createTestComponent } from 'test/utils';
import { TaskList } from './task-list';
import { TaskItem } from './task-item';


describe('TaskList', () => {
  let props;
  let tasks;
  let taskList;


  beforeEach(() => {
    tasks = [
      {completed: false, title: 'active task'},
      {completed: true, title: 'completed task'}
    ];

    props = {
      tasks,
      deleteTask: sinon.spy(),
      updateTask: sinon.spy()
    };

    taskList = createTestComponent(TaskList, props);
  });


  describe('Instantiation:', () => {
    it('should set #props.tasks with an array', () => {
      expect(Array.isArray(taskList.props.tasks)).toEqual(true);
    });
  });


  describe('DOM:', () => {
    it('should render all tasks', () => {
      let taskItems = scryRenderedComponentsWithType(taskList, TaskItem);
      expect(taskItems.length).toEqual(2);
    });

    it('should render active tasks', () => {
      taskList = createTestComponent(TaskList, {filter: 'active', ...props});
      let taskItems = scryRenderedComponentsWithType(taskList, TaskItem);

      expect(taskItems.length).toEqual(1);
      expect(taskItems[0].props.task.completed).toEqual(false);
    });

    it('should render completed tasks', () => {
      taskList = createTestComponent(TaskList, {filter: 'completed', ...props});
      let taskItems = scryRenderedComponentsWithType(taskList, TaskItem);

      expect(taskItems.length).toEqual(1);
      expect(taskItems[0].props.task.completed).toEqual(true);
    });
  });
});
