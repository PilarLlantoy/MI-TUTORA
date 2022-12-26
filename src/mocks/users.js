import { mock } from 'src/utils/axios';
import wait from 'src/utils/wait';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from 'src/utils/jwt';
import randomId from 'src/utils/randomId';

let users = [
  {
    id: '1',
    name: 'César David',
    fatherLastName: 'Rafael',
    motherLastName: 'Artica',
    avatar: '',
    email: 'crafael@pucp.edu.pe',
    password: '1234562895',
    career: 'Ingeniería Informática',
    university: 'Pontificia Universidad Católica del Perú',
    role: 'member',
    coverImg: '/static/images/placeholders/covers/1.jpg',
    description:
      'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem quam pede lobortis ligula, sit amet eleifend.'
  },
  {
    id: '2',
    name: 'Dayana',
    fatherLastName: 'Alarcón',
    motherLastName: 'Fuentes',
    avatar: '/static/images/avatars/2.jpg',
    email: 'dalarcon@urp.edu.pe',
    password: 'soyDayanaASDASD',
    career: 'Ingeniería civil',
    university: 'Ricaldo Palma',
    role: 'associated',
    coverImg: '/static/images/placeholders/covers/5.jpg',
    followers: 400,
    qualification: 2,
    description:
      'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem quam pede lobortis ligula, sit amet eleifend.'
  },
  {
    id: '3',
    name: 'Franccesco',
    fatherLastName: 'Jaimes',
    motherLastName: 'Agreda',
    avatar: '',
    email: 'fjaimes@pucp.edu.pe',
    password: 'soyEstudiante',
    career: 'Ingeniería Informática',
    university: 'Pontificia Universidad Católica del Perú',
    role: 'student',
    coverImg: '/static/images/placeholders/covers/3.jpg',
    description:
      'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem quam pede lobortis ligula, sit amet eleifend.'
  }
];

mock.onGet('/api/users').reply(() => {
  return [200, { users }];
});

mock.onGet('/api/associates').reply(() => {
  const associates = users.filter((u) => u.role === 'associated');
  return [200, { associates }];
});

mock.onGet('/api/students').reply(() => {
  const students = users.filter((u) => u.role === 'client');
  return [200, { students }];
});

mock.onGet('/api/user').reply((config) => {
  const { userId } = config.params;
  const user = users.find((_user) => _user.id === userId);

  return [200, { user }];
});

mock.onPost('/api/account/login').reply(async (config) => {
  await wait(1000);

  try {
    const { email, password } = JSON.parse(config.data);

    const user = users.find((_user) => _user.email === email);

    if (!user || user.password !== password) {
      return [
        400,
        { message: 'Verify that your email and password are correct' }
      ];
    }

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          fatherLastName: user.fatherLastName,
          motherLastName: user.motherLastName,
          avatar: user.avatar,
          career: user.career,
          university: user.university,
          coverImg: user.coverImg,
          description: user.description
        }
      }
    ];
  } catch (err) {
    console.error('Error: ', err);
    return [500, { message: 'Encountered a server error' }];
  }
});

mock.onPost('/api/associated/register').reply(async (config) => {
  // await wait(1000);

  try {
    const {
      email,
      name,
      fatherLastName,
      motherLastName,
      career,
      university,
      description
    } = JSON.parse(config.data);

    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [400, { message: 'This user already exists' }];
    }

    user = {
      id: randomId(),
      name,
      email,
      role: 'associated',
      fatherLastName,
      motherLastName,
      avatar: null,
      career,
      qualification: 1,
      university,
      description
    };

    users.push(user);

    return [
      200,
      {
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          fatherLastName: user.fatherLastName,
          motherLastName: user.motherLastName,
          name: user.name,
          role: user.role,
          career: user.career,
          qualification: user.qualification,
          university: user.university,
          description: user.description
        }
      }
    ];
  } catch (err) {
    console.error('Error: ', err);
    return [500, { message: 'Encountered a server error' }];
  }
});

mock.onGet('/api/account/personal').reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Auth token is missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const { userId } = decode(accessToken);
    const user = users.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: 'Invalid auth token' }];
    }

    return [
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          fatherLastName: user.fatherLastName,
          motherLastName: user.motherLastName,
          avatar: user.avatar,
          career: user.career,
          university: user.university,
          coverImg: user.coverImg,
          description: user.description
        }
      }
    ];
  } catch (err) {
    console.error('Error: ', err);
    return [500, { message: 'Encountered a server error' }];
  }
});
