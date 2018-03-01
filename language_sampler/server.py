from flask import Flask, g, jsonify
import sqlite3
from flask import render_template, request, redirect, url_for, abort
from math import ceil

app = Flask(__name__)

# Set up and initialize db
def get_db():
    if not hasattr(g, 'sqlite_db'):
        db_name = app.config.get('DATABASE', 'stimuli.db')
        g.sqlite_db = sqlite3.connect(db_name)

    return g.sqlite_db


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    init_db()
    print('Initialized the database.')


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, 'sqlite_db', None)
    if db is not None:
        db.close()
# ------------------------------

# main router
@app.route('/')
def root():
    # create db connection
    conn = get_db()
    # create cursor object with squawk query
    cursor_object = conn.execute('SELECT ID, description, source from stimuli order by id desc')
    # iterate over all squawks and store
    stimuli = cursor_object.fetchall()

    return render_template('index.html', stimuli=stimuli)


# add a squawk via post request
# @app.route('/add_squawk', methods=['POST'])
# def add_squawk():
#     # server side validation of squawk length
#     if len(request.form['squawk_text']) > 140:
#         abort(400)
#     # create db connection and store the squawk
#     conn = get_db()
#     conn.execute('INSERT INTO squawks (squawk_text) VALUES (?)', [request.form['squawk_text']])
#     conn.commit()
#     return redirect(url_for('root'))


# TODO create a JSON API that lists all possible squawks
# @app.route('/api/squawks', methods=['GET'])
# def list_squawks():
#     # create db connection
#     conn = get_db()
#     # create cursor object with squawk query
#     cursor_object = conn.execute('SELECT ID, squawk_text from squawks order by id desc')
#     # iterate over all squawks and store
#     squawks = cursor_object.fetchall()
#     return jsonify(squawks)


if __name__ == '__main__':
    app.run()
