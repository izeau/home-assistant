-- Up
create table users (
  id    integer primary key not null,
  name  text                not null
);

create table lists (
  id      integer primary key not null,
  name    text                not null,
  userId  integer,
  foreign key (userId)
    references users (id)
    on update cascade
    on delete cascade
);

create table items (
  id      integer primary key not null,
  name    text                not null,
  checked boolean             not null,
  listId  integer             not null,
  foreign key (listId)
    references lists (id)
    on update cascade
    on delete cascade
);

create index list_ix_userId on lists (userId);
create index item_ix_listId on items (listId);

insert into users (name)
           values ('Sophie'),
                  ('Jean');

insert into lists (name,              userId)
           values ('Liste de Sophie', 1),
                  ('Liste de Jean',   2),
                  ('Choses à faire',  null);

insert into items (name,     checked, listId)
           values ('Item 1', 0,       1),
                  ('Item 2', 1,       1),
                  ('Item 3', 0,       1),

                  ('Item 1', 0,       2),
                  ('Item 2', 1,       2),
                  ('Item 3', 0,       2),

                  ('Item 1', 0,       3),
                  ('Item 2', 1,       3),
                  ('Item 3', 0,       3);

-- Down
drop table users;
drop table lists;
drop table items;
