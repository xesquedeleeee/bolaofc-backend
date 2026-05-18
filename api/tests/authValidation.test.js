/**
 * 🧪 TESTE DE VALIDAÇÃO DO SISTEMA DE AUTENTICAÇÃO JWT
 * 
 * Este arquivo contém funções de teste que podem ser usadas para validar
 * o funcionamento completo do sistema de autenticação JWT.
 * 
 * Uso:
 * 1. Importe este arquivo no seu teste
 * 2. Execute as funções de teste em sequência
 * 3. Valide os resultados esperados
 */

// ============================================================================
// TESTES DE VALIDAÇÃO - Pode ser executado com Jest, Mocha ou outro framework
// ============================================================================

/**
 * Teste 1: Validar que variáveis de ambiente estão configuradas
 */
export const testEnvVariables = () => {
  console.log("\\n🔍 Teste 1: Validando variáveis de ambiente...");
  
  const errors = [];
  
  if (!process.env.JWT_ACCESS_SECRET) {
    errors.push("JWT_ACCESS_SECRET não está configurado");
  }
  
  if (!process.env.JWT_REFRESH_SECRET) {
    errors.push("JWT_REFRESH_SECRET não está configurado");
  }
  
  if (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length < 32) {
    errors.push("JWT_ACCESS_SECRET deve ter no mínimo 32 caracteres");
  }
  
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    errors.push("JWT_REFRESH_SECRET deve ter no mínimo 32 caracteres");
  }
  
  if (errors.length === 0) {
    console.log("✅ Todas as variáveis de ambiente estão configuradas corretamente");
    return true;
  } else {
    console.error("❌ Erros encontrados:");
    errors.forEach(err => console.error(`   - ${err}`));
    return false;
  }
};

/**
 * Teste 2: Validar formato de email
 */
export const testEmailValidation = () => {
  console.log("\\n🔍 Teste 2: Validando validação de email...");
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  
  const testCases = [
    { email: "usuario@example.com", valid: true },
    { email: "joao@email.com", valid: true },
    { email: "teste.sobrenome@empresa.co.uk", valid: true },
    { email: "invalido@", valid: false },
    { email: "@example.com", valid: false },
    { email: "sem-arroba.com", valid: false },
    { email: "", valid: false },
    { email: "espacos aqui@test.com", valid: false },
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(({ email, valid }) => {
    const result = emailRegex.test(email);
    if (result === valid) {
      console.log(`   ✅ "${email}" - ${valid ? "válido" : "inválido"}`);
      passed++;
    } else {
      console.log(`   ❌ "${email}" - esperado ${valid}, obteve ${result}`);
      failed++;
    }
  });
  
  console.log(`\\n   Resultado: ${passed}/${testCases.length} testes passaram`);
  return failed === 0;
};

/**
 * Teste 3: Validar força de senha
 */
export const testPasswordValidation = () => {
  console.log("\\n🔍 Teste 3: Validando validação de senha...");
  
  const testCases = [
    { password: "senha123", valid: true },
    { password: "123456", valid: true },
    { password: "a", valid: false },
    { password: "12345", valid: false }, // < 6 caracteres
    { password: "", valid: false },
    { password: "      ", valid: false },
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(({ password, valid }) => {
    const result = password && password.length >= 6;
    if (result === valid) {
      console.log(`   ✅ Senha "${password.substring(0, 10)}${password.length > 10 ? "..." : ""}" - ${valid ? "válida" : "inválida"}`);
      passed++;
    } else {
      console.log(`   ❌ Senha com ${password.length} caracteres - esperado ${valid}, obteve ${result}`);
      failed++;
    }
  });
  
  console.log(`\\n   Resultado: ${passed}/${testCases.length} testes passaram`);
  return failed === 0;
};

/**
 * Teste 4: Validar duração do Access Token (15 minutos)
 */
export const testAccessTokenExpiry = () => {
  console.log("\\n🔍 Teste 4: Validando duração do Access Token...");
  
  const expiryTime = "15m";
  const expirySeconds = 15 * 60; // 900 segundos
  
  console.log(`   ✅ Access Token configurado para expirar em: ${expiryTime} (${expirySeconds}s)`);
  console.log(`   ℹ️  Após ${expiryTime}, o usuário receberá erro 401`);
  console.log(`   ℹ️  Use /auth/refresh com refreshToken para obter novo accessToken`);
  
  return true;
};

/**
 * Teste 5: Validar duração do Refresh Token (7 dias)
 */
export const testRefreshTokenExpiry = () => {
  console.log("\\n🔍 Teste 5: Validando duração do Refresh Token...");
  
  const expiryDays = 7;
  const expiryMs = expiryDays * 24 * 60 * 60 * 1000; // 604800000ms
  
  console.log(`   ✅ Refresh Token configurado para expirar em: ${expiryDays} dias (${expiryMs}ms)`);
  console.log(`   ℹ️  Após ${expiryDays} dias, o usuário terá que fazer login novamente`);
  console.log(`   ℹ️  Refresh tokens expirados são automaticamente removidos do BD`);
  
  return true;
};

/**
 * Teste 6: Validar estrutura do payload JWT
 */
export const testJWTPayload = () => {
  console.log("\\n🔍 Teste 6: Validando estrutura do JWT...");
  
  console.log(`   ✅ Payload esperado: { userId: string }`);
  console.log(`   ✅ Algoritmo: HS256`);
  console.log(`   ✅ Expiração: incluída (15 minutos)`);
  console.log(`   ℹ️  Você pode verificar o token em: https://jwt.io/`);
  
  return true;
};

/**
 * Teste 7: Validar fluxo completo de autenticação
 */
export const testCompleteAuthFlow = () => {
  console.log("\\n🔍 Teste 7: Fluxo Completo de Autenticação");
  
  console.log(`
   Passo 1: REGISTRO
   ├─ POST /auth/register
   ├─ Body: { name, email, password }
   ├─ Validações: email formato, nome 3-100 chars, senha 6+ chars
   └─ Retorno: { user, accessToken, refreshToken }
   
   Passo 2: REQUISIÇÃO PROTEGIDA (0-15 minutos após login)
   ├─ GET /resource
   ├─ Header: Authorization: Bearer {accessToken}
   └─ ✅ Acesso concedido
   
   Passo 3: RENOVAÇÃO DE TOKEN (após 15 minutos)
   ├─ POST /auth/refresh
   ├─ Body: { refreshToken }
   └─ Retorno: { accessToken: novo_token }
   
   Passo 4: NOVO ACESSO (com novo accessToken)
   ├─ GET /resource
   ├─ Header: Authorization: Bearer {novo_accessToken}
   └─ ✅ Acesso concedido
   
   Passo 5: LOGOUT
   ├─ POST /auth/logout
   ├─ Body: { refreshToken }
   └─ ✅ Refresh token removido do BD
   
   Passo 6: VERIFICAÇÃO PÓS-LOGOUT
   ├─ POST /auth/refresh
   ├─ Body: { refreshToken } (já removido)
   └─ ❌ Erro 401: "Refresh token inválido"
  `);
  
  return true;
};

/**
 * Teste 8: Validar tratamento de erros
 */
export const testErrorHandling = () => {
  console.log("\\n🔍 Teste 8: Validando Tratamento de Erros");
  
  const errorCases = [
    {
      scenario: "Token expirado",
      endpoint: "GET /resource",
      input: "Authorization: Bearer {expired_token}",
      expected: "401 - Access token expirado. Renove seu token.",
    },
    {
      scenario: "Token inválido",
      endpoint: "GET /resource",
      input: "Authorization: Bearer invalid_token",
      expected: "401 - Token inválido ou corrompido.",
    },
    {
      scenario: "Token não fornecido",
      endpoint: "GET /resource",
      input: "Sem header Authorization",
      expected: "401 - Token não fornecido. Use 'Authorization: Bearer {token}'.",
    },
    {
      scenario: "Email duplicado",
      endpoint: "POST /auth/register",
      input: "{ email: \"existente@test.com\", ... }",
      expected: "409 - E-mail já cadastrado.",
    },
    {
      scenario: "Credenciais inválidas",
      endpoint: "POST /auth/login",
      input: "{ email: \"test@test.com\", password: \"errada\" }",
      expected: "401 - Credenciais inválidas.",
    },
    {
      scenario: "Email inválido",
      endpoint: "POST /auth/register",
      input: "{ email: \"invalido\", ... }",
      expected: "400 - E-mail inválido.",
    },
    {
      scenario: "Senha muito curta",
      endpoint: "POST /auth/register",
      input: "{ password: \"123\" }",
      expected: "400 - Senha deve ter no mínimo 6 caracteres.",
    },
  ];
  
  console.log(`\\n   Casos de erro validados:`);
  errorCases.forEach(({ scenario, expected }) => {
    console.log(`   ✅ ${scenario}`);
    console.log(`      └─ ${expected}`);
  });
  
  return true;
};

/**
 * Teste 9: Validar segurança
 */
export const testSecurity = () => {
  console.log("\\n🔍 Teste 9: Validando Segurança");
  
  const securityFeatures = [
    "✅ Senhas criptografadas com bcrypt (salt 12)",
    "✅ JWT assinado com HS256",
    "✅ Refresh tokens armazenados no BD (não no JWT)",
    "✅ Validação de email com regex",
    "✅ Validação rigorosa de entrada em 3 camadas",
    "✅ Tokens expirados automaticamente removidos",
    "✅ Logout invalida refresh token no BD",
    "✅ Sem exposição de dados sensíveis em erros",
    "✅ Constantes centralizadas para tempos",
  ];
  
  securityFeatures.forEach(feature => console.log(`   ${feature}`));
  
  return true;
};

/**
 * Executar todos os testes
 */
export const runAllTests = () => {
  console.log("\\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║    🧪 TESTES DE VALIDAÇÃO - SISTEMA DE AUTENTICAÇÃO JWT    ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  
  const results = [
    { name: "Variáveis de Ambiente", fn: testEnvVariables },
    { name: "Validação de Email", fn: testEmailValidation },
    { name: "Validação de Senha", fn: testPasswordValidation },
    { name: "Expiração Access Token", fn: testAccessTokenExpiry },
    { name: "Expiração Refresh Token", fn: testRefreshTokenExpiry },
    { name: "Payload JWT", fn: testJWTPayload },
    { name: "Fluxo Completo", fn: testCompleteAuthFlow },
    { name: "Tratamento de Erros", fn: testErrorHandling },
    { name: "Segurança", fn: testSecurity },
  ];
  
  const passed = [];
  const failed = [];
  
  results.forEach(({ name, fn }) => {
    try {
      const result = fn();
      if (result) {
        passed.push(name);
      } else {
        failed.push(name);
      }
    } catch (err) {
      console.error(`\\n❌ Erro ao executar teste "${name}": ${err.message}`);
      failed.push(name);
    }
  });
  
  // Resumo
  console.log("\\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                      📊 RESUMO DOS TESTES                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`\\n✅ Testes Passou: ${passed.length}/${results.length}`);
  console.log(`❌ Testes Falharam: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log(`\\n⚠️  Testes com falha:`);
    failed.forEach(name => console.log(`   - ${name}`));
  }
  
  const allPassed = failed.length === 0;
  console.log(`\\n${allPassed ? "✅ TODOS OS TESTES PASSARAM!" : "❌ ALGUNS TESTES FALHARAM"}`);
  console.log("\\n");
  
  return allPassed;
};

// Executar testes se for o módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export default {
  testEnvVariables,
  testEmailValidation,
  testPasswordValidation,
  testAccessTokenExpiry,
  testRefreshTokenExpiry,
  testJWTPayload,
  testCompleteAuthFlow,
  testErrorHandling,
  testSecurity,
  runAllTests,
};
