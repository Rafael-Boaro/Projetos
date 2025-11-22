const bcrypt = require('bcrypt');
const saltRounds = 10;
const minhaNovaSenha = '1234';

bcrypt.hash(minhaNovaSenha, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar o hash:', err);
        return;
    }
    console.log('Use este comando SQL para criar o novo usuário:');
    console.log('\n');
    console.log(`INSERT INTO users (username, password_hash) VALUES ('novo_admin', '${hash}');`);
    console.log('\n');
    console.log(`(Se quiser um nome diferente, troque 'novo_admin' no comando acima)`);
});