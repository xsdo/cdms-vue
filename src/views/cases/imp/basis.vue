<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="诊断" >
        <el-select v-model="queryParams.impId" size="small">
          <el-option
            v-for="item in impOptions"
            :key="item.impId"
            :label="item.impName"
            :value="item.impId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="诊断依据" prop="basis">
        <el-input
          v-model="queryParams.basis"
          placeholder="请输入诊断依据"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cases:imp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cases:imp:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cases:imp:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['cases:basis:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="basisList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="依据ID" align="center" prop="id" />
      <!--<el-table-column label="诊断ID" align="center" prop="impId" />-->
      <el-table-column label="诊断依据" align="center" prop="basis" />
      <el-table-column label="是否标题" align="center" prop="flag">
      <template slot-scope="scope" >
        <div>{{scope.row.flag === '0' ? '是' : '否'}}</div>
      </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:imp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:imp:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改诊断依据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-row>
          <el-col :span="24">
            <el-form-item label="诊断名称" prop="impId">
              <el-input v-model="impName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="诊断依据" prop="basis">
              <el-input type="textarea" v-model="form.basis" placeholder="请输入诊断依据" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="2">
            <el-form-item label="是否标题" prop="flag">
              <el-tooltip class="item" effect="dark" content="选择是否标题" placement="top-start">
                <el-checkbox-button >√</el-checkbox-button>
              </el-tooltip>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
          <el-form-item label="是否标题" prop="flag">
            <el-radio-group v-model="form.flag">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
          <!--<el-col :span="12">
            <el-button
              type="primary" plain
              icon="el-icon-plus"
              size="mini"
              @click="addOptions"
            >添加依据选项</el-button>
          </el-col>
          <el-col :span="12">
            <el-button
              type="warning" plain
              icon="el-icon-minus"
              size="mini"
              @click="deleteOptions"
            >删减依据选项</el-button>
          </el-col>-->
        </el-row>

      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBasis, getBasis, delBasis, addBasis, updateBasis, exportBasis } from "@/api/cases/imp/basis";
import { listImp, getImp } from "@/api/cases/imp/imp";

export default {
  name:"Basis",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      basisList: [],
      impOptions:[],
      impName:undefined,
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        impId: undefined,
        basis: undefined,
        flag: undefined,
      },
      form: {},
      rules: {

      }
    };
  },
  created() {
    const impId = this.$route.params && this.$route.params.pid;
    console.log(impId);
    this.getImp(impId);
    this.getImpList();
  },
  methods: {

    addOptions(){

    },


    //查询诊断
    getImp(impId) {
      getImp(impId).then(response => {
        console.log(response)
        this.queryParams.impId = response.data.impId;
        this.impName = response.data.impName;
        this.getList();
      });
    },
    getImpList() {
      listImp().then(response => {
        this.impOptions = response.rows;
      });
    },
    getList() {
      this.loading = true;
      listBasis(this.queryParams).then(response => {
        this.basisList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        impId: this.queryParams.impId,
        basis: undefined,
        flag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getImp(this.queryParams.impId);
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加诊断依据";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBasis(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改诊断依据";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBasis(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBasis(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除诊断依据编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBasis(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有诊断依据数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBasis(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style lang="scss">
  .el-checkbox-button:last-child .el-checkbox-button__inner{
    border-radius: 100%;
  }
</style>
